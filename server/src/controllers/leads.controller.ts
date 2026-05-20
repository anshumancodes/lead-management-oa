import { Response, NextFunction } from "express";
import { leadsService } from "../services/leads.service.js";
import { ApiResponse } from "../common/response.js";
import { ApiError } from "../common/error.js";
import type {
  AuthRequest,
  LeadQueryDTO,
  CreateLeadDTO,
  UpdateLeadDTO,
} from "../types/index.js";

// Leads Controller

export const leadsController = {
  // GET /api/v1/leads , it Supports: status, source, search, sort, page, limit

  async find(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as LeadQueryDTO;
      const result = await leadsService.find(query);
      res
        .status(200)
        .json(new ApiResponse(200, result, "Leads fetched successfully"));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/leads/export/csv
  // Exports filtered leads as a CSV download (Admin only).
  async exportCsv(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as Omit<
        LeadQueryDTO,
        "page" | "limit"
      >;
      const leads = await leadsService.findAll(query);

      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Status",
        "Source",
        "Notes",
        "Created At",
      ];
      const rows = leads.map((l) => [
        (l._id as { toString(): string }).toString(),
        l.name,
        l.email,
        l.phone ?? "",
        l.status,
        l.source,
        (l.notes ?? "").replace(/,/g, " "),
        new Date(l.createdAt).toISOString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="leads_${Date.now()}.csv"`,
      );
      res.status(200).send(csvContent);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const doc = await leadsService.findById(req.params.id);
      res
        .status(200)
        .json(new ApiResponse(200, doc, "Lead fetched successfully"));
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, status, source, notes } =
        req.body as CreateLeadDTO;

      if (!name?.trim()) throw new ApiError(400, "Name is required");
      if (!email?.trim()) throw new ApiError(400, "Email is required");
      if (!source) throw new ApiError(400, "Source is required");

      const doc = await leadsService.create({
        name,
        email,
        phone,
        status,
        source,
        notes,
        createdBy: req.user?._id,
      });
      res
        .status(201)
        .json(new ApiResponse(201, doc, "Lead created successfully"));
    } catch (err) {
      next(err);
    }
  },

  async patch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payload: UpdateLeadDTO & { updatedBy?: string } = {
        ...req.body,
        updatedBy: req.user?._id,
      };
      const doc = await leadsService.patch(req.params.id, payload);
      res
        .status(200)
        .json(new ApiResponse(200, doc, "Lead updated successfully"));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const doc = await leadsService.remove(req.params.id, req.user!._id);
      res
        .status(200)
        .json(new ApiResponse(200, doc, "Lead deleted successfully"));
    } catch (err) {
      next(err);
    }
  },
};
