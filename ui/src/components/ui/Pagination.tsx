'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  // Build page numbers to display (max 5 visible)
  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3)  pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  if (totalPages <= 1) return null;

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 32, height: 32, borderRadius: 8, fontSize: 13, fontWeight: 500,
    border: '1px solid var(--border)', background: 'var(--surface)',
    color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: 'inherit',
  };

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{start}–{end}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> leads
      </p>

      <div className="flex items-center gap-1">
        <button
          style={{ ...btnBase, opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} style={{ ...btnBase, cursor: 'default', border: 'none', background: 'transparent' }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              style={{
                ...btnBase,
                background:   p === page ? 'var(--accent)'       : 'var(--surface)',
                color:        p === page ? '#fff'                 : 'var(--text-secondary)',
                borderColor:  p === page ? 'var(--accent)'        : 'var(--border)',
                fontWeight:   p === page ? 600 : 500,
              }}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          style={{ ...btnBase, opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
