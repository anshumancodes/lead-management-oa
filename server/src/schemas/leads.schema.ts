import mongoose, { Document, Model } from "mongoose";
import { LeadStatus, LeadSource } from "../types/index.js";

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: mongoose.Types.ObjectId | null;
  updatedBy: mongoose.Types.ObjectId | null;
  deletedBy: mongoose.Types.ObjectId | null;
  deleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadModel extends Model<ILeadDocument> {}

const leadsSchema = new mongoose.Schema<ILeadDocument, ILeadModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.New,
      required: true,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, "Source is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Indexes for search performance
leadsSchema.index({ name: "text", email: "text" });
leadsSchema.index({ status: 1 });
leadsSchema.index({ source: 1 });
leadsSchema.index({ createdAt: -1 });

export const Leads = mongoose.model<ILeadDocument, ILeadModel>(
  "Leads",
  leadsSchema,
);
