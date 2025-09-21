/**
 * API service for communicating directly with Supabase
 */

import { supabase } from './supabase';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface Influencer {
  id: string;
  name: string;
  platform: string;
  handle?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  industry?: string;
  audience_size?: number;
  engagement_rate?: number;
  location?: string;
  expertise_tags?: string[];
  audience_demographics?: Record<string, any>;
  contact_info?: Record<string, any>;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // New fields from database
  intent_score?: number;
  recent_mentions?: number;
  buying_signals?: string[];
  content_themes?: string[];
  audience_alignment?: {
    industries?: string[];
    job_titles?: string[];
    company_size?: string;
    alignment_score?: number;
  };
}

interface UserInfluencer {
  id: string;
  user_id: string;
  influencer_id: string;
  status: 'saved' | 'contacted' | 'warm' | 'cold' | 'partnered';
  notes?: string;
  priority: number;
  tags?: string[];
  last_contacted_at?: string;
  relationship_strength?: number;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  influencer?: Influencer;
}

interface AddToMyListRequest {
  influencer_id: string;
  notes?: string;
  priority?: number;
  tags?: string[];
}

interface UpdateUserInfluencerRequest {
  status?: 'saved' | 'contacted' | 'warm' | 'cold' | 'partnered';
  notes?: string;
  priority?: number;
  tags?: string[];
  last_contacted_at?: string;
}

class ApiService {
  private async getCurrentUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }
      return session?.user || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  private async getUserId(): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.id;
  }



  // Auth endpoints
  async signUp(email: string, password: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { success: true, message: 'User created successfully', data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Sign up failed' };
    }
  }

  async signIn(email: string, password: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { success: true, message: 'Signed in successfully', data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Sign in failed' };
    }
  }

  async signOut(): Promise<ApiResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { success: true, message: 'Signed out successfully' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Sign out failed' };
    }
  }

  async getProfile(): Promise<ApiResponse> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      return { success: true, message: 'Profile retrieved successfully', data: user };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to get profile' };
    }
  }

  async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { success: true, message: 'Profile updated successfully', data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  }

  // Influencer endpoints
  async getInfluencers(params: {
    page?: number;
    limit?: number;
    platform?: string;
    industry?: string;
    search?: string;
    minFollowers?: number;
  } = {}): Promise<PaginatedResponse<Influencer>> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 20;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('influencers')
        .select('*', { count: 'exact' });

      // Apply filters
      if (params.platform) {
        query = query.eq('platform', params.platform);
      }
      if (params.industry) {
        query = query.eq('industry', params.industry);
      }
      if (params.minFollowers) {
        query = query.gte('audience_size', params.minFollowers);
      }
      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,bio.ilike.%${params.search}%,expertise_tags.cs.{${params.search}}`);
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      // Apply sorting
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: data || [],
        total,
        page,
        limit,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      };
    } catch (error) {
      console.error('Error fetching influencers:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch influencers');
    }
  }

  async getMyInfluencers(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<PaginatedResponse<UserInfluencer>> {
    try {
      const userId = await this.getUserId();
      const page = params.page || 1;
      const limit = params.limit || 20;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('user_influencers')
        .select(`
          *,
          influencer:influencers(*)
        `, { count: 'exact' })
        .eq('user_id', userId);

      if (params.status) {
        query = query.eq('status', params.status);
      }

      query = query.range(offset, offset + limit - 1);
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: data || [],
        total,
        page,
        limit,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      };
    } catch (error) {
      console.error('Error fetching my influencers:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch my influencers');
    }
  }

  async addToMyList(data: AddToMyListRequest): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      // Check if influencer exists
      const { data: influencer, error: influencerError } = await supabase
        .from('influencers')
        .select('id')
        .eq('id', data.influencer_id)
        .single();

      if (influencerError || !influencer) {
        return { success: false, message: 'Influencer not found' };
      }

      // Check if already in user's list
      const { data: existing } = await supabase
        .from('user_influencers')
        .select('id')
        .eq('user_id', userId)
        .eq('influencer_id', data.influencer_id)
        .single();

      if (existing) {
        return { success: false, message: 'Influencer already in your list' };
      }

      // Add to user's list
      const { error } = await supabase
        .from('user_influencers')
        .insert({
          user_id: userId,
          influencer_id: data.influencer_id,
          status: 'saved',
          notes: data.notes || '',
          priority: data.priority || 0,
          tags: data.tags || [],
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Influencer added to your list successfully' };
    } catch (error) {
      console.error('Error adding influencer to list:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to add influencer to list' };
    }
  }

  async removeFromMyList(influencerId: string): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const { error } = await supabase
        .from('user_influencers')
        .delete()
        .eq('user_id', userId)
        .eq('influencer_id', influencerId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Influencer removed from your list successfully' };
    } catch (error) {
      console.error('Error removing influencer from list:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to remove influencer from list' };
    }
  }

  async updateMyInfluencer(influencerId: string, updates: UpdateUserInfluencerRequest): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const updateData: any = {};
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.last_contacted_at !== undefined) updateData.last_contacted_at = updates.last_contacted_at;

      const { error } = await supabase
        .from('user_influencers')
        .update(updateData)
        .eq('user_id', userId)
        .eq('influencer_id', influencerId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Influencer updated successfully' };
    } catch (error) {
      console.error('Error updating influencer:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to update influencer' };
    }
  }

  async checkSavedStatus(influencerId: string): Promise<{ is_saved: boolean; relationship?: UserInfluencer }> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await supabase
        .from('user_influencers')
        .select('*')
        .eq('user_id', userId)
        .eq('influencer_id', influencerId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw new Error(error.message);
      }

      return {
        is_saved: !!data,
        relationship: data || undefined,
      };
    } catch (error) {
      console.error('Error checking saved status:', error);
      return { is_saved: false, relationship: undefined };
    }
  }

  async updateRelationshipStrength(influencerId: string, strength: number): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const { error } = await supabase
        .from('user_influencers')
        .update({ relationship_strength: strength })
        .eq('user_id', userId)
        .eq('influencer_id', influencerId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: `Relationship strength updated to ${strength}` };
    } catch (error) {
      console.error('Error updating relationship strength:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to update relationship strength' };
    }
  }

  async setFollowUpDate(influencerId: string, date: Date): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const { error } = await supabase
        .from('user_influencers')
        .update({ follow_up_date: date.toISOString() })
        .eq('user_id', userId)
        .eq('influencer_id', influencerId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: `Follow-up date set to ${date.toLocaleDateString()}` };
    } catch (error) {
      console.error('Error setting follow-up date:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to set follow-up date' };
    }
  }

  // Campaign endpoints
  async getCampaigns(): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Campaigns retrieved successfully', data: data || [] };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to fetch campaigns' };
    }
  }

  async createCampaign(data: any): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Campaign created successfully', data: campaign };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to create campaign' };
    }
  }

  async updateCampaign(campaignId: string, data: any): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const { data: campaign, error } = await supabase
        .from('campaigns')
        .update(data)
        .eq('id', campaignId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Campaign updated successfully', data: campaign };
    } catch (error) {
      console.error('Error updating campaign:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to update campaign' };
    }
  }

  async deleteCampaign(campaignId: string): Promise<ApiResponse> {
    try {
      const userId = await this.getUserId();

      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'Campaign deleted successfully' };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to delete campaign' };
    }
  }
}

export const apiService = new ApiService();
export type { Influencer, UserInfluencer, AddToMyListRequest, UpdateUserInfluencerRequest };
