import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  console.error('[ERROR HANDLER]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  sendError(res, message, status);
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}
