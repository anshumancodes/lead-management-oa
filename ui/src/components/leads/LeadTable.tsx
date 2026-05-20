'use client';

import { useState } from 'react';
import { Eye, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadSourceBadge } from './LeadSourceBadge';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from './LeadForm';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Lead, CreateLeadInput } from '@/types/lead';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  isAdmin: boolean;
  onUpdate: (id: string, data: Partial<CreateLeadInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onViewDetail: (lead: Lead) => void;
  onCreateClick: () => void;
}

export function LeadTable({
  leads,
  loading,
  isAdmin,
  onUpdate,
  onDelete,
  onViewDetail,
  onCreateClick,
}: LeadTableProps) {
  const [editLead, setEditLead]         = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead]     = useState<Lead | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <Spinner label="Fetching leads…" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <EmptyState
          title="No leads found"
          description="Create your first lead or adjust your filters."
          action={<Button onClick={onCreateClick} leftIcon={<span>+</span>}>Add Lead</Button>}
        />
      </div>
    );
  }

  const handleDeleteConfirm = async () => {
    if (!deleteLead) return;
    setDeleteLoading(true);
    try {
      await onDelete(deleteLead._id);
      setDeleteLead(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const thStyle: React.CSSProperties = {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface-2)',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th style={thStyle}>Name / Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Source</th>
                <th style={thStyle}>Created</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, idx) => (
                <tr
                  key={lead._id}
                  style={{
                    borderBottom: idx < leads.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  {/* Name / Email */}
                  <td style={{ padding: '14px 16px' }}>
                    <div>
                      <button
                        onClick={() => onViewDetail(lead)}
                        className="text-sm font-semibold transition-colors"
                        style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                      >
                        {lead.name}
                      </button>
                      <div className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Mail size={10} />
                        {lead.email}
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td style={{ padding: '14px 16px' }}>
                    {lead.phone ? (
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Phone size={12} />
                        {lead.phone}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <LeadStatusBadge status={lead.status} size="sm" />
                  </td>

                  {/* Source */}
                  <td style={{ padding: '14px 16px' }}>
                    <LeadSourceBadge source={lead.source} size="sm" />
                  </td>

                  {/* Created */}
                  <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn onClick={() => onViewDetail(lead)} title="View details" color="var(--accent)">
                        <Eye size={14} />
                      </IconBtn>
                      <IconBtn onClick={() => setEditLead(lead)} title="Edit lead" color="var(--warning)">
                        <Pencil size={14} />
                      </IconBtn>
                      {isAdmin && (
                        <IconBtn onClick={() => setDeleteLead(lead)} title="Delete lead" color="var(--danger)">
                          <Trash2 size={14} />
                        </IconBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            initial={editLead}
            submitLabel="Update Lead"
            onSubmit={async (data) => {
              await onUpdate(editLead._id, data);
              setEditLead(null);
            }}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteLead} onClose={() => setDeleteLead(null)} title="Delete Lead" maxWidth="400px">
        <div className="flex flex-col gap-5">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{deleteLead?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteLead(null)}>Cancel</Button>
            <Button variant="danger" loading={deleteLoading} onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function IconBtn({ children, onClick, title, color }: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 8,
        color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = color;
        el.style.background = 'var(--surface-2)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = 'var(--text-muted)';
        el.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}
