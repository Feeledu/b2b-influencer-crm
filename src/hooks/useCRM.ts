import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

interface Interaction {
  id: string;
  influencer_id: string;
  campaign_id?: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'file_upload';
  subject?: string;
  content?: string;
  file_url?: string;
  interaction_date: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

interface CreateInteractionRequest {
  influencer_id: string;
  campaign_id?: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'file_upload';
  subject?: string;
  content?: string;
  file_url?: string;
}

interface CreateCampaignRequest {
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: string;
  goals?: string[];
}

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

// Interactions hooks
export const useInteractions = (influencerId?: string) => {
  return useQuery({
    queryKey: ['interactions', influencerId],
    queryFn: () => apiRequest(`/interactions${influencerId ? `?influencer_id=${influencerId}` : ''}`),
    enabled: !!getAuthToken(),
  });
};

export const useCreateInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInteractionRequest) => 
      apiRequest('/interactions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
    },
  });
};

export const useUpdateInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Interaction> }) => 
      apiRequest(`/interactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
    },
  });
};

export const useDeleteInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/interactions/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
    },
  });
};

// Campaigns hooks
export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiRequest('/campaigns'),
    enabled: !!getAuthToken(),
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => 
      apiRequest('/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) => 
      apiRequest(`/campaigns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/campaigns/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

// Campaign Influencers hooks
export const useCampaignInfluencers = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-influencers', campaignId],
    queryFn: () => apiRequest(`/campaigns/${campaignId}/influencers`),
    enabled: !!campaignId && !!getAuthToken(),
  });
};

export const useAssignInfluencerToCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: any }) => 
      apiRequest(`/campaigns/${campaignId}/influencers`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-influencers', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useUpdateCampaignAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, influencerId, data }: { campaignId: string; influencerId: string; data: any }) => 
      apiRequest(`/campaigns/${campaignId}/influencers/${influencerId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-influencers', variables.campaignId] });
    },
  });
};

export const useRemoveCampaignAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ campaignId, influencerId }: { campaignId: string; influencerId: string }) => 
      apiRequest(`/campaigns/${campaignId}/influencers/${influencerId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign-influencers', variables.campaignId] });
    },
  });
};

// CRM-specific influencer hooks
export const useCRMInfluencers = (filters?: {
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);
  if (filters?.sort_order) queryParams.append('sort_order', filters.sort_order);
  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());

  return useQuery({
    queryKey: ['crm-influencers', filters],
    queryFn: () => apiRequest(`/influencers/my/crm?${queryParams.toString()}`),
    enabled: !!getAuthToken(),
  });
};

export const useUpdateRelationshipStrength = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ influencerId, strength }: { influencerId: string; strength: number }) => 
      apiRequest(`/influencers/${influencerId}/relationship?strength=${strength}`, {
        method: 'PUT',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-influencers'] });
      queryClient.invalidateQueries({ queryKey: ['my-influencers'] });
    },
  });
};

export const useSetFollowUpDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ influencerId, followUpDate }: { influencerId: string; followUpDate: string }) => 
      apiRequest(`/influencers/${influencerId}/follow-up?follow_up_date=${followUpDate}`, {
        method: 'PUT',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-influencers'] });
      queryClient.invalidateQueries({ queryKey: ['my-influencers'] });
    },
  });
};
