import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware factory.
 * Pass a Zod schema and it validates req.body / req.params / req.query as defined.
 *
 * Usage: router.post('/', validate(createPropertySchema), controller.create)
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        for (const issue of error.issues) {
          const path = issue.path.slice(1).join('.') || issue.path[0]?.toString() || 'unknown';
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(issue.message);
        }

        _res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: fieldErrors,
        });
        return;
      }
      next(error);
    }
  };
};
