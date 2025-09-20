import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: string;
  goals?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignInfluencer {
  id: string;
  campaign_id: string;
  influencer_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_url?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignData {
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: string;
  goals?: string[];
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {}

export interface CreateCampaignInfluencerData {
  influencer_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  status?: 'planned' | 'active' | 'completed' | 'cancelled';
  notes?: string;
}

// Hook to fetch all campaigns
export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await apiService.getCampaigns();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single campaign
export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const response = await apiService.request(`/campaigns/${campaignId}`);
      return response.data;
    },
    enabled: !!campaignId,
  });
};

// Hook to create a new campaign
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCampaignData) => {
      const response = await apiService.createCampaign(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

// Hook to update a campaign
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, data }: { campaignId: string; data: UpdateCampaignData }) => {
      const response = await apiService.updateCampaign(campaignId, data);
      return response.data;
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  });
};

// Hook to delete a campaign
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await apiService.deleteCampaign(campaignId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

// Hook to add influencer to campaign
export const useAddCampaignInfluencer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, data }: { campaignId: string; data: CreateCampaignInfluencerData }) => {
      const response = await apiService.request(`/campaigns/${campaignId}/influencers`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data;
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  });
};

// Hook to remove influencer from campaign
export const useRemoveCampaignInfluencer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, influencerId }: { campaignId: string; influencerId: string }) => {
      const response = await apiService.request(`/campaigns/${campaignId}/influencers/${influencerId}`, {
        method: 'DELETE',
      });
      return response.data;
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  });
};
