import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/index.js';


export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}



const userSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SalesUser,
    },
  },
  { timestamps: true }
);

// Pre-save: hash password

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare password 

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};



export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
