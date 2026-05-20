'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard',    href: '/leads',   icon: LayoutDashboard },
  { label: 'Leads',        href: '/leads',   icon: Users           },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    router.push('/login');
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: 'var(--accent)', boxShadow: '0 0 16px rgb(99 102 241 / 0.4)' }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>LeadFlow</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Lead Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className="group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
              style={{
                background: active ? 'var(--accent-light)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} style={{ color: 'var(--accent)' }} />}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div
          className="mb-3 rounded-xl p-3"
          style={{ background: 'var(--surface-2)' }}
        >
          <div
            className="mb-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{
              background: user?.role === 'Admin' ? 'var(--accent-light)' : 'var(--success-light)',
              color: user?.role === 'Admin' ? 'var(--accent)' : 'var(--success)',
            }}
          >
            {user?.role ?? '—'}
          </div>
          <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {user?.name ?? 'Loading…'}
          </p>
          <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150"
          style={{ color: 'var(--danger)', background: 'transparent' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--danger-light)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
