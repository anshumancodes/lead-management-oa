'use client';

import type { LeadSource } from '@/types/lead';
import { Globe, AtSign, Users } from 'lucide-react';

const config: Record<LeadSource, { Icon: React.ElementType; color: string; bg: string }> = {
  Website:   { Icon: Globe,    color: '#6366f1', bg: '#eef2ff' },
  Instagram: { Icon: AtSign,   color: '#ec4899', bg: '#fdf2f8' },
  Referral:  { Icon: Users,    color: '#f59e0b', bg: '#fffbeb' },
};

interface Props { source: LeadSource; size?: 'sm' | 'md' }

export function LeadSourceBadge({ source, size = 'md' }: Props) {
  const c = config[source];
  const { Icon } = c;
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
      <Icon size={11} />
      {source}
    </span>
  );
}
