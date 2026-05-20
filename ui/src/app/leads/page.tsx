'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Download, Users, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadForm } from '@/components/leads/LeadForm';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { LeadSourceBadge } from '@/components/leads/LeadSourceBadge';
import { useLeads } from '@/hooks/useLeads';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api';
import { buildQueryString } from '@/lib/csv';
import type { Lead, CreateLeadInput, LeadQuery } from '@/types/lead';
import type { ApiResponse, PaginatedData } from '@/types/api';

// Stat card 
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: React.ElementType; color: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: `${color}18`, color }}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

// Main Page 
export default function LeadsPage() {
  const { user, isAdmin } = useAuth();
  const { leads, pagination, loading, fetchLeads, createLead, updateLead, deleteLead } = useLeads();

  const [query, setQuery]           = useState<LeadQuery>({ page: 1, limit: 10, sort: 'latest' });
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen]   = useState(false);
  const [detailLead, setDetailLead]   = useState<Lead | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [statsLoading, setStatsLoading]   = useState(true);
  const [stats, setStats] = useState({ total: 0, new: 0, qualified: 0, lost: 0 });

  const debouncedSearch = useDebounce(searchInput, 350);

  // Sync debounced search into query
  useEffect(() => {
    setQuery((q) => ({ ...q, search: debouncedSearch || undefined, page: 1 }));
  }, [debouncedSearch]);

  // Fetch leads whenever query changes
  useEffect(() => {
    fetchLeads(query);
  }, [query, fetchLeads]);

  // Load stats from summary counts
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const [all, newL, qual, lost] = await Promise.all([
          api.get<ApiResponse<PaginatedData<Lead>>>('/leads?limit=1'),
          api.get<ApiResponse<PaginatedData<Lead>>>('/leads?status=New&limit=1'),
          api.get<ApiResponse<PaginatedData<Lead>>>('/leads?status=Qualified&limit=1'),
          api.get<ApiResponse<PaginatedData<Lead>>>('/leads?status=Lost&limit=1'),
        ]);
        setStats({
          total:     all.data.data.pagination.total,
          new:       newL.data.data.pagination.total,
          qualified: qual.data.data.pagination.total,
          lost:      lost.data.data.pagination.total,
        });
      } catch { /* silent */ } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [leads]); // refresh stats whenever leads change

  const patchQuery = (patch: Partial<LeadQuery>) => setQuery((q) => ({ ...q, ...patch }));

  const resetFilters = () => {
    setSearchInput('');
    setQuery({ page: 1, limit: 10, sort: 'latest' });
  };

  const handleCreate = async (data: CreateLeadInput) => {
    try {
      await createLead(data);
      toast.success('Lead created successfully!');
      setCreateOpen(false);
      fetchLeads(query);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to create lead';
      toast.error(msg);
      throw err;
    }
  };

  const handleUpdate = async (id: string, data: Partial<CreateLeadInput>) => {
    try {
      await updateLead(id, data);
      toast.success('Lead updated!');
      fetchLeads(query);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to update lead';
      toast.error(msg);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      fetchLeads(query);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to delete lead';
      toast.error(msg);
      throw err;
    }
  };

  const handleExportCsv = async () => {
    if (!isAdmin) { toast.error('Only Admins can export CSV'); return; }
    setExportLoading(true);
    try {
      const { status, source, search, sort } = query;
      const qs = buildQueryString({ status, source, search, sort });
      const { data } = await api.get<ApiResponse<PaginatedData<Lead>>>(`/leads/export/csv?${qs}`, {
        responseType: 'blob',
      });
      // The server returns CSV directly; trigger download
      const blob = new Blob([data as unknown as BlobPart], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `leads_${Date.now()}.csv`;
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/*  Stats  */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl" style={{ background: 'var(--surface)' }} />
          ))
        ) : (
          <>
            <StatCard label="Total Leads"     value={stats.total}     icon={Users}       color="#6366f1" />
            <StatCard label="New"             value={stats.new}       icon={TrendingUp}  color="#3b82f6" />
            <StatCard label="Qualified"       value={stats.qualified} icon={UserCheck}   color="#22c55e" />
            <StatCard label="Lost"            value={stats.lost}      icon={UserX}       color="#ef4444" />
          </>
        )}
      </div>

      {/*  Header  */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>All Leads</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {pagination.total} total · page {pagination.page} of {pagination.totalPages}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              id="export-csv-btn"
              variant="secondary"
              loading={exportLoading}
              onClick={handleExportCsv}
              leftIcon={<Download size={14} />}
            >
              Export CSV
            </Button>
          )}
          <Button
            id="create-lead-btn"
            onClick={() => setCreateOpen(true)}
            leftIcon={<Plus size={14} />}
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/*  Filters  */}
      <LeadFilters
        query={{ ...query, search: searchInput }}
        onChange={(patch) => {
          if ('search' in patch) {
            setSearchInput(patch.search ?? '');
          } else {
            patchQuery(patch);
          }
        }}
        onReset={resetFilters}
      />

      {/*  Table  */}
      <LeadTable
        leads={leads}
        loading={loading}
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onViewDetail={(lead) => setDetailLead(lead)}
        onCreateClick={() => setCreateOpen(true)}
      />

      {/*  Pagination  */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={(p) => patchQuery({ page: p })}
      />

      {/*  Create Modal  */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add New Lead">
        <LeadForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} submitLabel="Create Lead" />
      </Modal>

      {/*  Detail Modal  */}
      <Modal open={!!detailLead} onClose={() => setDetailLead(null)} title="Lead Details" maxWidth="480px">
        {detailLead && <LeadDetail lead={detailLead} />}
      </Modal>
    </div>
  );
}

//  Lead Detail card (inside modal)
function LeadDetail({ lead }: { lead: Lead }) {
  const rows = [
    { label: 'Email',   value: lead.email },
    { label: 'Phone',   value: lead.phone ?? '—' },
    { label: 'Notes',   value: lead.notes ?? '—' },
    { label: 'Created', value: new Date(lead.createdAt).toLocaleString() },
    { label: 'Updated', value: new Date(lead.updatedAt).toLocaleString() },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ background: 'var(--accent)' }}
        >
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <LeadStatusBadge status={lead.status} />
            <LeadSourceBadge source={lead.source} />
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="flex items-start gap-4 px-4 py-3"
            style={{
              borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'var(--surface-2)' : 'var(--surface)',
            }}
          >
            <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', paddingTop: 2 }}>{r.label}</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
