
import { useState, useEffect, useCallback } from 'react';

interface UseApiDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiData<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data from API...');
      const result = await apiCall();
      console.log('API data received:', result);
      setData(result);
    } catch (err) {
      console.error('API fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Don't show error toast for every failed request, just log it
      console.warn('API call failed, component should handle gracefully:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useApiData;
