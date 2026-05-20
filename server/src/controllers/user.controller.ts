import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { ApiResponse } from '../common/response.js';

export const userController = {

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.find(req.query);
      res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully'));
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await userService.findById(req.params.id);
      res.status(200).json(new ApiResponse(200, doc, 'User fetched successfully'));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...req.body, createdBy: (req as any).user?._id };
      const doc = await userService.create(payload);
      res.status(201).json(new ApiResponse(201, doc, 'User created successfully'));
    } catch (err) {
      next(err);
    }
  },

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...req.body, updatedBy: (req as any).user?._id };
      const doc = await userService.patch(req.params.id, payload);
      res.status(200).json(new ApiResponse(200, doc, 'User updated successfully'));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await userService.remove(req.params.id, (req as any).user?._id);
      res.status(200).json(new ApiResponse(200, doc, 'User deleted successfully'));
    } catch (err) {
      next(err);
    }
  },
};
