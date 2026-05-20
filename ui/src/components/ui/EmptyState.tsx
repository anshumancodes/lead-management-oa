'use client';

import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your filters or search query.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
      >
        <Inbox size={32} />
      </div>
      <div>
        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
      {action}
    </div>
  );
}
