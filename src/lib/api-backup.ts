/**
 * API service for communicating with the backend
 */

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
  private getAuthToken(): string | null {
    return localStorage.getItem('supabase.auth.token');
  }

  private isDemoMode(): boolean {
    return !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // In demo mode, return mock data
    if (this.isDemoMode()) {
      return this.getMockData(endpoint, options);
    }

    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
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
              job_titles: ['CMO', 'Marketing Director', 'VP Marketing', 'Growth Manager']
            },
            contact_info: {
              email: 'sarah@sarahchen.com',
              linkedin: 'https://linkedin.com/in/sarahchen'
            },
            is_verified: true,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            ai_confidence: 0.92,
            industry: 'SaaS'
          },
          {
            id: '2',
            name: 'Tech Talk Podcast',
            platform: 'Podcast',
            handle: '@techtalkpod',
            bio: 'Weekly podcast featuring SaaS founders and growth experts',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            website_url: 'https://techtalkpod.com',
            email: 'host@techtalkpod.com',
            linkedin_url: 'https://linkedin.com/company/techtalkpod',
            twitter_url: 'https://twitter.com/techtalkpod',
            industry: 'Technology',
            audience_size: 15000,
            engagement_rate: 8.1,
            location: 'New York, NY',
            expertise_tags: ['SaaS', 'Startups', 'Technology', 'Entrepreneurship'],
            audience_demographics: {
              buyer_alignment_score: 78,
              age_range: '28-50',
              company_size: '10-1000 employees',
              job_titles: ['CEO', 'CTO', 'Founder', 'VP Engineering']
            },
            contact_info: {
              email: 'host@techtalkpod.com',
              linkedin: 'https://linkedin.com/company/techtalkpod'
            },
            is_verified: true,
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-10T10:00:00Z',
            ai_confidence: 0.88,
            industry: 'Technology'
          },
          {
            id: '3',
            name: 'SaaS Weekly',
            platform: 'Newsletter',
            handle: '@saasweekly',
            bio: 'Weekly newsletter covering SaaS trends, tools, and strategies',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            website_url: 'https://saasweekly.com',
            email: 'editor@saasweekly.com',
            linkedin_url: 'https://linkedin.com/in/saasweekly',
            twitter_url: 'https://twitter.com/saasweekly',
            industry: 'SaaS',
            audience_size: 8000,
            engagement_rate: 12.3,
            location: 'Austin, TX',
            expertise_tags: ['SaaS', 'Newsletter', 'Content Marketing', 'B2B'],
            audience_demographics: {
              buyer_alignment_score: 92,
              age_range: '30-55',
              company_size: '100-5000 employees',
              job_titles: ['VP Sales', 'Sales Director', 'Revenue Operations', 'CRO']
            },
            contact_info: {
              email: 'editor@saasweekly.com',
              linkedin: 'https://linkedin.com/in/saasweekly'
            },
            is_verified: true,
            created_at: '2024-01-05T10:00:00Z',
            updated_at: '2024-01-05T10:00:00Z',
            ai_confidence: 0.95,
            industry: 'SaaS'
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

    if (endpoint.includes('/add-to-my-list')) {
      return {
        success: true,
        message: 'Influencer added to your list successfully'
      } as T;
    }

    if (endpoint.includes('/remove-from-my-list')) {
      return {
        success: true,
        message: 'Influencer removed from your list successfully'
      } as T;
    }

    if (endpoint.includes('/update-my-influencer')) {
      return {
        success: true,
        message: 'Influencer updated successfully'
      } as T;
    }

    if (endpoint.includes('/check-saved')) {
      return {
        is_saved: false,
        relationship: null
      } as T;
    }

    return {} as T;
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
    return this.request<ApiResponse>('/influencers/add-to-my-list', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeFromMyList(influencerId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/influencers/remove-from-my-list/${influencerId}`, {
      method: 'DELETE',
    });
  }

  async updateMyInfluencer(
    influencerId: string,
    data: UpdateUserInfluencerRequest
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/influencers/update-my-influencer/${influencerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async checkSavedStatus(influencerId: string): Promise<{
    is_saved: boolean;
    relationship: UserInfluencer | null;
  }> {
    return this.request<{
      is_saved: boolean;
      relationship: UserInfluencer | null;
    }>(`/influencers/check-saved/${influencerId}`);
  }
}

export const apiService = new ApiService();
export type { Influencer, UserInfluencer, AddToMyListRequest, UpdateUserInfluencerRequest };
