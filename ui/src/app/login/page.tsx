'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim())    errs.email    = 'Email is required';
    if (!password)         errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login({ email, password });
      toast.success('Welcome back! 👋');
      router.push('/leads');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Login failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: 'var(--background)' }}
    >
      {/* Gradient blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div className="relative w-full" style={{ maxWidth: 420 }}>
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: 'var(--accent)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
            >
              <Zap size={24} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to LeadFlow</p>
            </div>
          </div>

          {/* Demo credentials banner */}
          <div
            className="mb-6 rounded-xl p-3 text-xs"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <p className="font-semibold mb-1">Demo credentials</p>
            <p>Admin: <code>admin@demo.com</code> / <code>Admin@123</code></p>
            <p>Sales: <code>sales@demo.com</code> / <code>Sales@123</code></p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-4">
              <Input
                id="login-email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                error={errors.email}
                leftIcon={<Mail size={14} />}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  id="login-password"
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  error={errors.password}
                  leftIcon={<Lock size={14} />}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: 'absolute', right: 10, top: errors.password ? 28 : 27,
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer',
                  }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <Button
                id="login-submit"
                type="submit"
                loading={loading}
                style={{ width: '100%', height: 44, marginTop: 4 }}
              >
                Sign in
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
