'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { UserRole } from '@/types/auth';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SalesUser' as UserRole });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form);
      toast.success('Account created! Welcome!!');
      router.push('/leads');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div className="relative w-full" style={{ maxWidth: 440 }}>
        <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--accent)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
              <Zap size={24} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create account</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Join LeadFlow today</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-4">
              <Input id="reg-name" label="Full Name" placeholder="Rahul Sharma" value={form.name} onChange={set('name')} error={errors.name} leftIcon={<User size={14} />} autoComplete="name" />
              <Input id="reg-email" label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} leftIcon={<Mail size={14} />} autoComplete="email" />
              <Input id="reg-password" label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} error={errors.password} leftIcon={<Lock size={14} />} autoComplete="new-password" />
              <Select
                id="reg-role"
                label="Role"
                value={form.role}
                onChange={set('role') as React.ChangeEventHandler<HTMLSelectElement>}
                options={[
                  { value: 'SalesUser', label: 'Sales User' },
                  { value: 'Admin',     label: 'Admin' },
                ]}
              />
              <Button id="reg-submit" type="submit" loading={loading} style={{ width: '100%', height: 44, marginTop: 4 }}>
                Create Account
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
