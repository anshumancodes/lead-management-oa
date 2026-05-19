import { Request, Response, NextFunction } from 'express';
import { leadsService } from './leads.service.js';
import { ApiResponse } from '../common/response.js';

export const leadsController = {

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leadsService.find(req.query);
      res.status(200).json(new ApiResponse(200, result, 'Leadss fetched successfully'));
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await leadsService.findById(req.params.id);
      res.status(200).json(new ApiResponse(200, doc, 'Leads fetched successfully'));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...req.body, createdBy: (req as any).user?._id };
      const doc = await leadsService.create(payload);
      res.status(201).json(new ApiResponse(201, doc, 'Leads created successfully'));
    } catch (err) {
      next(err);
    }
  },

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = { ...req.body, updatedBy: (req as any).user?._id };
      const doc = await leadsService.patch(req.params.id, payload);
      res.status(200).json(new ApiResponse(200, doc, 'Leads updated successfully'));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await leadsService.remove(req.params.id, (req as any).user?._id);
      res.status(200).json(new ApiResponse(200, doc, 'Leads deleted successfully'));
    } catch (err) {
      next(err);
    }
  },
};
