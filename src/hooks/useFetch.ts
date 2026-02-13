import { useState, useCallback } from 'react';

export interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFetch = <T,>() => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const result = await promise;
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, isLoading: false, error: err });
      throw err;
    }
  }, []);

  return { ...state, execute };
};
