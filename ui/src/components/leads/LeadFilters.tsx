'use client';

import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { LeadQuery, LeadStatus, LeadSource } from '@/types/lead';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/types/lead';

interface LeadFiltersProps {
  query: LeadQuery;
  onChange: (patch: Partial<LeadQuery>) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export function LeadFilters({ query, onChange, onReset }: LeadFiltersProps) {
  const hasFilters = !!(query.status || query.source || query.search);

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="min-w-[220px] flex-1">
          <Input
            id="lead-search"
            placeholder="Search by name or email…"
            value={query.search ?? ''}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            leftIcon={<Search size={14} />}
          />
        </div>

        {/* Status */}
        <div className="w-40">
          <Select
            id="lead-status-filter"
            value={query.status ?? ''}
            onChange={(e) => onChange({ status: e.target.value as LeadStatus | '', page: 1 })}
            options={statusOptions}
            aria-label="Filter by status"
          />
        </div>

        {/* Source */}
        <div className="w-40">
          <Select
            id="lead-source-filter"
            value={query.source ?? ''}
            onChange={(e) => onChange({ source: e.target.value as LeadSource | '', page: 1 })}
            options={sourceOptions}
            aria-label="Filter by source"
          />
        </div>

        {/* Sort */}
        <div className="w-40">
          <Select
            id="lead-sort"
            value={query.sort ?? 'latest'}
            onChange={(e) => onChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })}
            options={sortOptions}
            aria-label="Sort order"
          />
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex h-[38px] items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-all"
            style={{
              color: 'var(--danger)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {query.status && (
            <ActivePill label={`Status: ${query.status}`} onRemove={() => onChange({ status: '', page: 1 })} />
          )}
          {query.source && (
            <ActivePill label={`Source: ${query.source}`} onRemove={() => onChange({ source: '', page: 1 })} />
          )}
          {query.search && (
            <ActivePill label={`Search: "${query.search}"`} onRemove={() => onChange({ search: '', page: 1 })} />
          )}
        </div>
      )}
    </div>
  );
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-1 rounded-full"
        style={{ color: 'var(--accent)', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
        aria-label={`Remove filter ${label}`}
      >
        ×
      </button>
    </span>
  );
}
