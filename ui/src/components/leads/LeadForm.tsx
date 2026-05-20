'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Lead, CreateLeadInput, LeadStatus, LeadSource } from '@/types/lead';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/types/lead';

interface LeadFormProps {
  initial?: Partial<Lead>;
  onSubmit: (data: CreateLeadInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: s }));
const sourceOptions = LEAD_SOURCES.map((s) => ({ value: s, label: s }));

type FormErrors = Partial<Record<keyof CreateLeadInput, string>>;

export function LeadForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: LeadFormProps) {
  const [form, setForm] = useState<CreateLeadInput>({
    name:   initial?.name   ?? '',
    email:  initial?.email  ?? '',
    phone:  initial?.phone  ?? '',
    status: initial?.status ?? 'New',
    source: initial?.source ?? 'Website',
    notes:  initial?.notes  ?? '',
  });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof CreateLeadInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim())  errs.name   = 'Name is required';
    if (!form.email.trim()) errs.email  = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.source) errs.source = 'Source is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="lead-name"
            label="Name *"
            placeholder="Rahul Sharma"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
          />
          <Input
            id="lead-email"
            label="Email *"
            type="email"
            placeholder="rahul@example.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="lead-phone"
            label="Phone"
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone ?? ''}
            onChange={set('phone')}
          />
          <Select
            id="lead-source"
            label="Source *"
            value={form.source}
            onChange={set('source') as React.ChangeEventHandler<HTMLSelectElement>}
            options={sourceOptions}
            error={errors.source}
          />
        </div>

        <Select
          id="lead-status"
          label="Status"
          value={form.status}
          onChange={set('status') as React.ChangeEventHandler<HTMLSelectElement>}
          options={statusOptions}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-notes" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Notes
          </label>
          <textarea
            id="lead-notes"
            placeholder="Any additional notes…"
            value={form.notes ?? ''}
            onChange={set('notes')}
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={loading}>{submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
