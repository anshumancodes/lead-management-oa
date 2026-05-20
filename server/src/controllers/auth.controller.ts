import { Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { ApiResponse } from "../common/response.js";
import { ApiError } from "../common/error.js";
import type { AuthRequest, RegisterDTO, LoginDTO } from "../types/index.js";

// Auth Controller

export const authController = {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body as RegisterDTO;

      if (!name?.trim()) throw new ApiError(400, "Name is required");
      if (!email?.trim()) throw new ApiError(400, "Email is required");
      if (!password || password.length < 6)
        throw new ApiError(400, "Password must be at least 6 characters");

      const result = await authService.register({
        name,
        email,
        password,
        role,
      });
      res
        .status(201)
        .json(new ApiResponse(201, result, "Registration successful"));
    } catch (err) {
      next(err);
    }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as LoginDTO;

      if (!email?.trim()) throw new ApiError(400, "Email is required");
      if (!password) throw new ApiError(400, "Password is required");

      const result = await authService.login({ email, password });
      res.status(200).json(new ApiResponse(200, result, "Login successful"));
    } catch (err) {
      next(err);
    }
  },

  // / POST /api/v1/auth/logout

  async logout(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .json(new ApiResponse(200, null, "Logged out successfully"));
    } catch (err) {
      next(err);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!._id);
      res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
    } catch (err) {
      next(err);
    }
  },
};
