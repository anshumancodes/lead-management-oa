'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
        <Spinner size={32} label="Loading…" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: 'var(--sidebar-width)',
          paddingTop: 'var(--topbar-height)',
          minHeight: '100vh',
        }}
      >
        <Topbar title="Leads" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
