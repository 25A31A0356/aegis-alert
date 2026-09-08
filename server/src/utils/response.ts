import { Response } from 'express';
import { ApiResponse } from '../../../shared';

export function sendSuccess<T>(res: Response, data: T, meta?: ApiResponse<T>['meta'], status = 200): void {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
  res.status(status).json(payload);
}

export function sendError(res: Response, error: string, status = 400): void {
  const payload: ApiResponse = {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  res.status(status).json(payload);
}
