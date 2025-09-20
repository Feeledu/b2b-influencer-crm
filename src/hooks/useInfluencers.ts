import { useState, useEffect, useCallback } from 'react';
import { apiService, Influencer, UserInfluencer } from '@/lib/api';

interface UseInfluencersOptions {
  page?: number;
  limit?: number;
  platform?: string;
  industry?: string;
  search?: string;
}

interface UseMyInfluencersOptions {
  page?: number;
  limit?: number;
  status?: string;
}

export const useInfluencers = (options: UseInfluencersOptions = {}) => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  const fetchInfluencers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getInfluencers(options);
      setInfluencers(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        total_pages: response.total_pages,
        has_next: response.has_next,
        has_prev: response.has_prev,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch influencers');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.platform, options.industry, options.search]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  return {
    influencers,
    loading,
    error,
    pagination,
    refetch: fetchInfluencers,
  };
};

export const useMyInfluencers = (options: UseMyInfluencersOptions = {}) => {
  const [myInfluencers, setMyInfluencers] = useState<UserInfluencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  const fetchMyInfluencers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getMyInfluencers(options);
      setMyInfluencers(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        total_pages: response.total_pages,
        has_next: response.has_next,
        has_prev: response.has_prev,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch my influencers');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.status]);

  useEffect(() => {
    fetchMyInfluencers();
  }, [fetchMyInfluencers]);

  return {
    myInfluencers,
    loading,
    error,
    pagination,
    refetch: fetchMyInfluencers,
  };
};

export const useInfluencerActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToMyList = useCallback(async (influencerId: string, notes?: string, priority = 0, tags?: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.addToMyList({
        influencer_id: influencerId,
        notes,
        priority,
        tags,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add influencer to list');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromMyList = useCallback(async (influencerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.removeFromMyList(influencerId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove influencer from list');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInfluencer = useCallback(async (
    influencerId: string,
    updates: {
      status?: 'saved' | 'contacted' | 'warm' | 'cold' | 'partnered';
      notes?: string;
      priority?: number;
      tags?: string[];
      last_contacted_at?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.updateMyInfluencer(influencerId, updates);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update influencer');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSavedStatus = useCallback(async (influencerId: string) => {
    try {
      const result = await apiService.checkSavedStatus(influencerId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check saved status');
      return { is_saved: false, relationship: null };
    }
  }, []);

  return {
    addToMyList,
    removeFromMyList,
    updateInfluencer,
    checkSavedStatus,
    loading,
    error,
  };
};
