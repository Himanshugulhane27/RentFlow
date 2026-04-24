import cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  origin: [
  "http://localhost:5173",
  "https://rental-management-system-blue.vercel.app"
],

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: undefined,
  maxAge: 86400,
};
