import { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from './Skeleton';
import { cn } from '../../utils/cn';

export function FadeImage({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && <Skeleton className="absolute inset-0 w-full h-full" />}
      {/* @ts-expect-error - Framer Motion types conflict with React DOM types for some img props */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onLoad={() => setIsLoaded(true)}
        className={cn("w-full h-full object-cover", className)}
        {...props}
      />
    </div>
  );
}
