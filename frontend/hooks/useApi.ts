import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/lib/types/api';

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        
        if (mounted) {
          setData(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

// Specific hooks for common operations
export function usePrompts() {
  return useApi(() => apiClient.getPrompts());
}

export function useTestHistory() {
  return useApi(() => apiClient.getTestHistory());
}

export function useDashboardOverview() {
  return useApi(() => apiClient.getDashboardOverview());
}

export function useCostAnalytics(period: string = '30d') {
  return useApi(() => apiClient.getCostAnalytics(period), [period]);
}