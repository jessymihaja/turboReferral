import { useContext, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';

export function useAuthFetch() {
  const { token, logout } = useContext(UserContext);

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = options.headers || {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, { ...options, headers });
      
      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error('Session expirée, veuillez vous reconnecter.');
      }

      return res;
    } catch (error) {
      throw error;
    }
  }, [token, logout]);

  return authFetch;
}
