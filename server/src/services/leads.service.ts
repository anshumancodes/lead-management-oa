import { Leads } from '../schemas/leads.schema.js';
import { ApiError } from '../common/error.js';
import type {
  CreateLeadDTO,
  UpdateLeadDTO,
  LeadQueryDTO,
  PaginatedResponse,
} from '../types/index.js';
import { ILeadDocument } from '../schemas/leads.schema.js';


export const leadsService = {

  // fetch leads 
  async find(rawQuery: LeadQueryDTO, userId?: string): Promise<PaginatedResponse<ILeadDocument>> {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = rawQuery;

    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { deleted: { $ne: true } };

    if (status)  filter['status']  = status;
    if (source)  filter['source']  = source;

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter['$or'] = [{ name: regex }, { email: regex }];
    }

    // sort
    const sortOrder = sort === 'oldest' ? 1 : -1;

    // execute
    const [data, total] = await Promise.all([
      Leads.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Leads.countDocuments(filter),
    ]);

    return {
      data: data as unknown as ILeadDocument[],
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  },

  // Find all (no pagination) for CSV export.
  async findAll(rawQuery: Omit<LeadQueryDTO, 'page' | 'limit'>) {
    const { status, source, search, sort = 'latest' } = rawQuery;
    const filter: Record<string, any> = { deleted: { $ne: true } };

    if (status) filter['status'] = status;
    if (source) filter['source'] = source;
    if (search?.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter['$or'] = [{ name: regex }, { email: regex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    return Leads.find(filter).sort({ createdAt: sortOrder }).lean();
  },

  async findById(id: string) {
    const doc = await Leads.findOne({ _id: id, deleted: { $ne: true } })
      .populate('createdBy', 'name email')
      .lean();
    if (!doc) throw new ApiError(404, 'Lead not found');
    return doc;
  },

  async create(payload: CreateLeadDTO & { createdBy?: string }) {
    const doc = await Leads.create(payload);
    return doc;
  },

  async patch(id: string, payload: UpdateLeadDTO & { updatedBy?: string }) {
    const doc = await Leads.findOneAndUpdate(
      { _id: id, deleted: { $ne: true } },
      { $set: payload },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) throw new ApiError(404, 'Lead not found');
    return doc;
  },

  async remove(id: string, deletedBy: string) {
    const doc = await Leads.findOneAndUpdate(
      { _id: id, deleted: { $ne: true } },
      { $set: { deleted: true, deletedAt: new Date(), deletedBy } },
      { new: true }
    ).lean();
    if (!doc) throw new ApiError(404, 'Lead not found');
    return doc;
  },
};
