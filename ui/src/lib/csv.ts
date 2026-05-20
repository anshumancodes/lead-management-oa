import type { Lead, LeadQuery } from '@/types/lead';

// Build a CSV string from a lead array and trigger a browser download.

export function downloadLeadsCsv(leads: Lead[]): void {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Source', 'Notes', 'Created At'];

  const rows = leads.map((l) => [
    l._id,
    l.name,
    l.email,
    l.phone ?? '',
    l.status,
    l.source,
    l.notes ?? '',
    new Date(l.createdAt).toLocaleString(),
  ]);

  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escape).join(','),
    ...rows.map((r) => r.map(escape).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `leads_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert LeadQuery object to URLSearchParams string.

export function buildQueryString(query: LeadQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  });
  return params.toString();
}
