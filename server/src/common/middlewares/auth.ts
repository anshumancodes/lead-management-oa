import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../error.js';
import { User } from '../../schemas/user.schema.js';
import type { AuthRequest, JwtPayload, UserRole } from '../../types/index.js';

//Verify JWT Middleware 

export async function verifyJWT(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Accept token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const token =
      (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined) ??
      req.cookies?.token;

    if (!token) throw new ApiError(401, 'Authentication token missing');

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.userId).lean();
    if (!user) throw new ApiError(401, 'User not found or session expired');

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid or expired token'));
    } else {
      next(err);
    }
  }
}

// Role-Based Access Control Middleware 

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Not authenticated'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, 'Insufficient permissions for this action'));
      return;
    }
    next();
  };
}
