import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();
  const ts = new Date().toISOString();

  console.log(`[${ts}] --> ${req.method} ${req.originalUrl} (id=${requestId})`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] <-- ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms (id=${requestId})`
    );
  });

  next();
}
