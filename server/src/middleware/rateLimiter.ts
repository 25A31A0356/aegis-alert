import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const memoryStore: RateLimitStore = {};

export function createRateLimiter(windowMs: number, maxRequests: number, message = 'Too many requests, please try again later.') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!memoryStore[ip] || now > memoryStore[ip].resetTime) {
      memoryStore[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    memoryStore[ip].count++;

    if (memoryStore[ip].count > maxRequests) {
      return sendError(res, message, 429);
    }

    next();
  };
}

// Rate limiter for SOS and Safe Beacon endpoints (max 15 requests per minute per IP)
export const emergencyLimiter = createRateLimiter(60 * 1000, 15, 'Emergency rate limit exceeded. Please wait a moment before sending another request.');
