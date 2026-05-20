'use client';

import type { LeadStatus } from '@/types/lead';

const config: Record<LeadStatus, { label: string; bg: string; color: string; dot: string }> = {
  New:       { label: 'New',       bg: 'var(--info-light)',    color: 'var(--info)',    dot: '#3b82f6' },
  Contacted: { label: 'Contacted', bg: 'var(--warning-light)', color: 'var(--warning)', dot: '#f59e0b' },
  Qualified: { label: 'Qualified', bg: 'var(--success-light)', color: 'var(--success)', dot: '#22c55e' },
  Lost:      { label: 'Lost',      bg: 'var(--danger-light)',  color: 'var(--danger)',  dot: '#ef4444' },
};

interface Props {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export function LeadStatusBadge({ status, size = 'md' }: Props) {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-medium"
      style={{
        background: c.bg,
        color: c.color,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        fontSize: size === 'sm' ? '11px' : '12px',
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: c.dot, flexShrink: 0 }}
      />
      {c.label}
    </span>
  );
}
