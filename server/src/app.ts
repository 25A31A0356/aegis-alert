import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { ENV } from './config/env';

export function createApp(): Express {
  const app = express();

  // Security and utilities middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: '*', // Allow development origins
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Basic request logger
  app.use((req, _res, next) => {
    if (ENV.NODE_ENV !== 'test') {
      console.log(`[API] ${req.method} ${req.url} - ${new Date().toISOString()}`);
    }
    next();
  });

  // Mount API endpoints
  app.use('/api', apiRouter);

  // Fallback handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
