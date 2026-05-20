'use client';

import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  label?: string;
}

export function Spinner({ size = 24, label = 'Loading…' }: SpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-label={label}
    >
      <Loader2 size={size} className="animate-spin" style={{ color: 'var(--accent)' }} />
      {label && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
      )}
    </div>
  );
}
