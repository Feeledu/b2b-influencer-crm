/**
 * API service for communicating with the backend
 */

import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
  private async getAuthToken(): Promise<string | null> {
    try {
      console.log('🔍 Getting auth token...');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🔍 Session data:', { session: !!session, error, hasToken: !!session?.access_token });
      
      if (error) {
        console.error('❌ Error getting session:', error);
        return null;
      }
      
      if (!session) {
        console.log('❌ No session found');
        return null;
      }
      
      console.log('✅ Token found:', session.access_token?.substring(0, 20) + '...');
      return session.access_token || null;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      return null;
    }
  }

  private isDemoMode(): boolean {
    const isDemo = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
    console.log('🔍 Demo mode check:', { 
      hasUrl: !!import.meta.env.VITE_SUPABASE_URL, 
      hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      isDemo 
    });
    return isDemo;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log('🔍 Making API request:', { endpoint, options });
    
    // In demo mode, return mock data
    if (this.isDemoMode()) {
      console.log('🔍 Demo mode - returning mock data');
      return this.getMockData(endpoint, options);
    }

    const token = await this.getAuthToken();
    console.log('🔍 Token for request:', token ? 'Present' : 'Missing');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('🔍 Request config:', { 
      url: `${API_BASE_URL}${endpoint}`,
      headers: config.headers,
      method: config.method || 'GET'
    });

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      console.log('🔍 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      return data;
    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }

  private async getMockData<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.includes('/influencers/my-list')) {
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        total_pages: 0,
        has_next: false,
        has_prev: false
      } as T;
    }

    if (endpoint.includes('/influencers/') && !endpoint.includes('/my-list')) {
      return {
        data: [
          {
            id: '1',
            name: 'Sarah Chen',
            platform: 'LinkedIn',
            handle: '@sarahchen',
            bio: 'SaaS Marketing Expert | Helping B2B companies scale through content marketing',
            avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            website_url: 'https://sarahchen.com',
            email: 'sarah@sarahchen.com',
            linkedin_url: 'https://linkedin.com/in/sarahchen',
            twitter_url: 'https://twitter.com/sarahchen',
            industry: 'SaaS',
            audience_size: 25000,
            engagement_rate: 4.2,
            location: 'San Francisco, CA',
            expertise_tags: ['SaaS Marketing', 'Content Strategy', 'B2B Growth'],
            audience_demographics: {
              buyer_alignment_score: 85,
              age_range: '25-45',
              company_size: '50-500 employees',
              job_titles: ['Marketing Manager', 'VP Marketing', 'CMO', 'Growth Hacker']
            },
            contact_info: {
              email: 'sarah@sarahchen.com',
              linkedin: 'https://linkedin.com/in/sarahchen',
              twitter: 'https://twitter.com/sarahchen'
            },
            is_verified: true,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
            ai_confidence: 0.92
          },
          {
            id: '2',
            name: 'Mike Rodriguez',
            platform: 'Podcast',
            handle: '@mikerodriguez',
            bio: 'Host of "SaaS Unfiltered" podcast | 10+ years in B2B sales and marketing',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            website_url: 'https://mikerodriguez.com',
            email: 'mike@mikerodriguez.com',
            linkedin_url: 'https://linkedin.com/in/mikerodriguez',
            twitter_url: 'https://twitter.com/mikerodriguez',
            industry: 'SaaS',
            audience_size: 15000,
            engagement_rate: 6.8,
            location: 'Austin, TX',
            expertise_tags: ['B2B Sales', 'Podcast Hosting', 'Lead Generation', 'Sales Enablement'],
            audience_demographics: {
              buyer_alignment_score: 78,
              age_range: '30-50',
              company_size: '10-200 employees',
              job_titles: ['Sales Manager', 'VP Sales', 'Sales Director', 'Account Executive']
            },
            contact_info: {
              email: 'mike@mikerodriguez.com',
              linkedin: 'https://linkedin.com/in/mikerodriguez',
              twitter: 'https://twitter.com/mikerodriguez'
            },
            is_verified: true,
            created_at: '2024-01-10T14:20:00Z',
            updated_at: '2024-01-10T14:20:00Z',
            ai_confidence: 0.87
          },
          {
            id: '3',
            name: 'Alex Thompson',
            platform: 'Newsletter',
            handle: '@alexthompson',
            bio: 'Founder of "B2B Growth Weekly" | Former VP Marketing at 3 SaaS companies',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            website_url: 'https://alexthompson.com',
            email: 'alex@alexthompson.com',
            linkedin_url: 'https://linkedin.com/in/alexthompson',
            twitter_url: 'https://twitter.com/alexthompson',
            industry: 'SaaS',
            audience_size: 35000,
            engagement_rate: 5.1,
            location: 'New York, NY',
            expertise_tags: ['B2B Marketing', 'Newsletter Growth', 'Content Marketing', 'Marketing Automation'],
            audience_demographics: {
              buyer_alignment_score: 92,
              age_range: '28-45',
              company_size: '100-1000 employees',
              job_titles: ['Marketing Director', 'VP Marketing', 'CMO', 'Marketing Manager']
            },
            contact_info: {
              email: 'alex@alexthompson.com',
              linkedin: 'https://linkedin.com/in/alexthompson',
              twitter: 'https://twitter.com/alexthompson'
            },
            is_verified: true,
            created_at: '2024-01-05T09:15:00Z',
            updated_at: '2024-01-05T09:15:00Z',
            ai_confidence: 0.95
          }
        ],
        total: 3,
        page: 1,
        limit: 20,
        total_pages: 1,
        has_next: false,
        has_prev: false
      } as T;
    }

    return {} as T;
  }

  // Auth endpoints
  async signUp(email: string, password: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signIn(email: string, password: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signOut(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/signout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/profile');
  }

  async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Influencer endpoints
  async getInfluencers(params: {
    page?: number;
    limit?: number;
    platform?: string;
    industry?: string;
    search?: string;
  } = {}): Promise<PaginatedResponse<Influencer>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.platform) searchParams.set('platform', params.platform);
    if (params.industry) searchParams.set('industry', params.industry);
    if (params.search) searchParams.set('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = `/influencers${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<Influencer>>(endpoint);
  }

  async getMyInfluencers(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<PaginatedResponse<UserInfluencer>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.status) searchParams.set('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/influencers/my-list${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<UserInfluencer>>(endpoint);
  }

  async addToMyList(data: AddToMyListRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/influencers/my-list', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeFromMyList(influencerId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/influencers/my-list/${influencerId}`, {
      method: 'DELETE',
    });
  }

  async updateMyInfluencer(influencerId: string, updates: UpdateUserInfluencerRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/influencers/my-list/${influencerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async checkSavedStatus(influencerId: string): Promise<{ is_saved: boolean; relationship?: UserInfluencer }> {
    return this.request<{ is_saved: boolean; relationship?: UserInfluencer }>(`/influencers/${influencerId}/saved-status`);
  }

  // Campaign endpoints
  async getCampaigns(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/campaigns');
  }

  async createCampaign(data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(campaignId: string, data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(campaignId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export type { Influencer, UserInfluencer, AddToMyListRequest, UpdateUserInfluencerRequest };
