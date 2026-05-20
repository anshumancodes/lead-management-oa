/**
 * Seed script — populates the DB with demo users and leads for development.
 * Run with: npx tsx src/seed.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from './schemas/user.schema.js';
import { Leads } from './schemas/leads.schema.js';
import { LeadStatus, LeadSource, UserRole } from './types/index.js';

const MONGO_URI = process.env.MONGO_URI!;

const users = [
  { name: 'Admin User',     email: 'admin@demo.com',  password: 'Admin@123',  role: UserRole.Admin },
  { name: 'Sales Rep',      email: 'sales@demo.com',  password: 'Sales@123',  role: UserRole.SalesUser },
];

const leadSeed = [
  { name: 'Rahul Sharma',    email: 'rahul@example.com',   phone: '9876543210', status: LeadStatus.Qualified, source: LeadSource.Instagram, notes: 'Interested in enterprise plan' },
  { name: 'Priya Mehta',     email: 'priya@example.com',   phone: '9123456789', status: LeadStatus.New,       source: LeadSource.Website,   notes: 'Signed up via landing page' },
  { name: 'Amit Joshi',      email: 'amit@example.com',    phone: '9000112233', status: LeadStatus.Contacted, source: LeadSource.Referral,  notes: 'Referred by Rahul' },
  { name: 'Sneha Patel',     email: 'sneha@example.com',   phone: '9988776655', status: LeadStatus.Lost,      source: LeadSource.Website,   notes: 'Budget constraints' },
  { name: 'Vikram Singh',    email: 'vikram@example.com',  phone: '9871234560', status: LeadStatus.New,       source: LeadSource.Instagram, notes: 'DM response' },
  { name: 'Anjali Gupta',    email: 'anjali@example.com',  phone: '9001234567', status: LeadStatus.Qualified, source: LeadSource.Referral,  notes: 'High priority' },
  { name: 'Rohan Kumar',     email: 'rohan@example.com',   phone: '9811223344', status: LeadStatus.Contacted, source: LeadSource.Website,   notes: 'Demo scheduled' },
  { name: 'Kavita Reddy',    email: 'kavita@example.com',  phone: '9834567890', status: LeadStatus.New,       source: LeadSource.Instagram, notes: '' },
  { name: 'Suresh Nair',     email: 'suresh@example.com',  phone: '9776655443', status: LeadStatus.Lost,      source: LeadSource.Referral,  notes: 'Chose competitor' },
  { name: 'Deepika Verma',   email: 'deepika@example.com', phone: '9900887766', status: LeadStatus.Qualified, source: LeadSource.Website,   notes: 'Trial extended' },
  { name: 'Manish Agarwal',  email: 'manish@example.com',  phone: '9112233445', status: LeadStatus.New,       source: LeadSource.Instagram, notes: 'Cold outreach' },
  { name: 'Pooja Iyer',      email: 'pooja@example.com',   phone: '9654321098', status: LeadStatus.Contacted, source: LeadSource.Referral,  notes: 'Warm introduction' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Leads.deleteMany({});
  console.log('🗑️  Cleared existing users and leads');

  // Create users
  const createdUsers = await User.insertMany(users);
  const adminUser = createdUsers.find(u => u.role === UserRole.Admin)!;
  console.log(`👤 Created ${createdUsers.length} users`);

  // Create leads attributed to admin
  const leadsWithOwner = leadSeed.map(l => ({ ...l, createdBy: adminUser._id }));
  await Leads.insertMany(leadsWithOwner);
  console.log(`📋 Created ${leadsWithOwner.length} leads`);

  console.log('\n🎉 Seed complete!');
  console.log('   Admin:     admin@demo.com  / Admin@123');
  console.log('   SalesUser: sales@demo.com  / Sales@123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
