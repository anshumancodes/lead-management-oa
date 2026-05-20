'use client';

import { ThemeToggle } from './ThemeToggle';
import { Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title = 'Dashboard' }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header
      className="fixed right-0 top-0 z-30 flex items-center justify-between px-6"
      style={{
        left: 'var(--sidebar-width)',
        height: 'var(--topbar-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell placeholder */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-all"
          style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)' }}
        >
          <Bell size={16} />
        </button>

        <ThemeToggle />

        {/* Avatar */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: 'var(--accent)' }}
          title={user?.name}
        >
          {user?.name?.charAt(0).toUpperCase() ?? '?'}
        </div>
      </div>
    </header>
  );
}
