import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      success: (data: unknown, message?: string, statusCode?: number) => void;
      failure: (message: string, statusCode?: number, errors?: unknown[]) => void;
    }
  }
}

export function responseMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  res.success = (data: unknown, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({ success: true, statusCode, message, data });
  };

  res.failure = (message = 'Something went wrong', statusCode = 500, errors: unknown[] = []) => {
    res.status(statusCode).json({ success: false, statusCode, message, errors });
  };

  next();
}
