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
        console.log('❌ No session found - using demo token for development');
        // For development, return a demo token that the backend can recognize
        return 'demo-token-for-development';
      }
      
      console.log('✅ Token found:', session.access_token?.substring(0, 20) + '...');
      return session.access_token || null;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      // For development, return a demo token
      return 'demo-token-for-development';
    }
  }

  private isDemoMode(): boolean {
    // Demo mode disabled - always use real API calls
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log('🔍 Making API request:', { endpoint, options });

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
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
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
      
      // If it's an auth error, provide a more helpful message
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Authentication required. Please sign in to access campaigns.');
      }
      
      // If it's a timeout, provide a helpful message
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  private getMockInfluencerById(id: string) {
    const mockInfluencers = [
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
          age_range: '25-45 years old',
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
          age_range: '30-50 years old',
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
      }
    ];
    
    return mockInfluencers.find(inf => inf.id === id);
  }

  private async getMockData<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.includes('/influencers/my-list')) {
      // Get saved influencers from localStorage
      const savedInfluencers = JSON.parse(localStorage.getItem('mock_saved_influencers') || '[]');
      console.log('🔍 Mock API: Getting my-list, found:', savedInfluencers.length, 'saved influencers');
      console.log('🔍 Mock API: Saved influencers:', savedInfluencers);
      return {
        data: savedInfluencers,
        total: savedInfluencers.length,
        page: 1,
        limit: 20,
        total_pages: Math.ceil(savedInfluencers.length / 20),
        has_next: false,
        has_prev: false
      } as T;
    }

    // Handle POST requests for adding influencers
    if (options.method === 'POST' && endpoint.includes('/influencers/my-list')) {
      console.log('🔍 Mock API: Adding influencer to my-list');
      const body = JSON.parse(options.body as string);
      console.log('🔍 Mock API: Request body:', body);
      
      const savedInfluencers = JSON.parse(localStorage.getItem('mock_saved_influencers') || '[]');
      console.log('🔍 Mock API: Current saved influencers:', savedInfluencers.length);
      
      // Find the influencer to add
      const influencerToAdd = this.getMockInfluencerById(body.influencer_id);
      console.log('🔍 Mock API: Found influencer to add:', influencerToAdd?.name);
      
      if (influencerToAdd) {
        const userInfluencer = {
          id: `ui_${Date.now()}`,
          user_id: 'demo-user-123',
          influencer_id: body.influencer_id,
          status: 'saved',
          notes: body.notes || '',
          priority: body.priority || 0,
          tags: body.tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          influencer: influencerToAdd
        };
        
        savedInfluencers.push(userInfluencer);
        localStorage.setItem('mock_saved_influencers', JSON.stringify(savedInfluencers));
        console.log('🔍 Mock API: Added influencer, new count:', savedInfluencers.length);
      } else {
        console.error('❌ Mock API: Could not find influencer with ID:', body.influencer_id);
      }
      
      return { success: true, message: 'Influencer added successfully' } as T;
    }

    // Handle DELETE requests for removing influencers
    if (options.method === 'DELETE' && endpoint.includes('/influencers/my-list/')) {
      const influencerId = endpoint.split('/').pop();
      const savedInfluencers = JSON.parse(localStorage.getItem('mock_saved_influencers') || '[]');
      const filtered = savedInfluencers.filter((ui: any) => ui.influencer_id !== influencerId);
      localStorage.setItem('mock_saved_influencers', JSON.stringify(filtered));
      
      return { success: true, message: 'Influencer removed successfully' } as T;
    }

    // Handle GET requests for checking saved status
    if (endpoint.includes('/influencers/') && endpoint.includes('/saved-status/')) {
      const influencerId = endpoint.split('/').pop();
      const savedInfluencers = JSON.parse(localStorage.getItem('mock_saved_influencers') || '[]');
      const isSaved = savedInfluencers.some((ui: any) => ui.influencer_id === influencerId);
      
      return {
        is_saved: isSaved,
        relationship: isSaved ? savedInfluencers.find((ui: any) => ui.influencer_id === influencerId) : null
      } as T;
    }

    if (endpoint.includes('/influencers') && !endpoint.includes('/my-list')) {
      // Get saved influencers from localStorage to mark them as saved
      const savedInfluencers = JSON.parse(localStorage.getItem('mock_saved_influencers') || '[]');
      const savedIds = savedInfluencers.map((ui: any) => ui.influencer_id);
      
      // Parse query parameters for filtering
      const url = new URL(`http://localhost:3000${endpoint}`);
      const minFollowers = url.searchParams.get('min_followers');
      const platform = url.searchParams.get('platform');
      const industry = url.searchParams.get('industry');
      const search = url.searchParams.get('search');
      
      console.log('🔍 Mock API: Filter params:', { minFollowers, platform, industry, search });
      
      let allInfluencers = [
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
            is_saved: savedIds.includes('1'),
            audience_demographics: {
              buyer_alignment_score: 85,
              age_range: '25-45 years old',
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
            is_saved: savedIds.includes('2'),
            audience_demographics: {
              buyer_alignment_score: 78,
              age_range: '30-50 years old',
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
        ];
        
        // Apply filters
        let filteredInfluencers = allInfluencers;
        
        if (minFollowers) {
          const minFollowersNum = parseInt(minFollowers);
          filteredInfluencers = filteredInfluencers.filter(inf => inf.audience_size >= minFollowersNum);
        }
        
        if (platform) {
          filteredInfluencers = filteredInfluencers.filter(inf => inf.platform === platform);
        }
        
        if (industry) {
          filteredInfluencers = filteredInfluencers.filter(inf => inf.industry === industry);
        }
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredInfluencers = filteredInfluencers.filter(inf => 
            inf.name.toLowerCase().includes(searchLower) ||
            inf.bio.toLowerCase().includes(searchLower) ||
            inf.expertise_tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        console.log('🔍 Mock API: Filtered influencers:', filteredInfluencers.length);
        
        return {
          data: filteredInfluencers,
          total: filteredInfluencers.length,
          page: 1,
          limit: 20,
          total_pages: Math.ceil(filteredInfluencers.length / 20),
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
    minFollowers?: number;
  } = {}): Promise<PaginatedResponse<Influencer>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.platform) searchParams.set('platform', params.platform);
    if (params.industry) searchParams.set('industry', params.industry);
    if (params.search) searchParams.set('search', params.search);
    if (params.minFollowers) searchParams.set('min_followers', params.minFollowers.toString());

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
    return this.request<{ is_saved: boolean; relationship?: UserInfluencer }>(`/influencers/check-saved/${influencerId}`);
  }

  async updateRelationshipStrength(influencerId: string, strength: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/influencers/${influencerId}/relationship?strength=${strength}`, {
      method: 'PUT',
    });
  }

  async setFollowUpDate(influencerId: string, date: Date): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/influencers/${influencerId}/follow-up?follow_up_date=${date.toISOString()}`, {
      method: 'PUT',
    });
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
