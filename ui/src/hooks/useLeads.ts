'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { buildQueryString } from '@/lib/csv';
import type { Lead, CreateLeadInput, UpdateLeadInput, LeadQuery } from '@/types/lead';
import type { ApiResponse, PaginatedData } from '@/types/api';

export function useLeads() {
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [pagination, setPagination]     = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const fetchLeads = useCallback(async (query: LeadQuery = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryString(query);
      const { data } = await api.get<ApiResponse<PaginatedData<Lead>>>(`/leads?${qs}`);
      setLeads(data.data.data);
      setPagination(data.data.pagination);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Failed to fetch leads';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = useCallback(async (input: CreateLeadInput): Promise<Lead> => {
    const { data } = await api.post<ApiResponse<Lead>>('/leads', input);
    return data.data;
  }, []);

  const updateLead = useCallback(async (id: string, input: UpdateLeadInput): Promise<Lead> => {
    const { data } = await api.patch<ApiResponse<Lead>>(`/leads/${id}`, input);
    return data.data;
  }, []);

  const deleteLead = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  }, []);

  const getLead = useCallback(async (id: string): Promise<Lead> => {
    const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data.data;
  }, []);

  return {
    leads,
    pagination,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    getLead,
  };
}
