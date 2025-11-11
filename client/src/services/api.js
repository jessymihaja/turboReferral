import { API_URL, STORAGE_KEYS } from '../config/constants';
import { NetworkStatus } from '../utils/networkStatus';

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.onUnauthorized = null;
    this.onServerUnavailable = null;
  }

  setUnauthorizedCallback(callback) {
    this.onUnauthorized = callback;
  }

  setServerUnavailableCallback(callback) {
    this.onServerUnavailable = callback;
  }

  async retry(fn, maxRetries = 2, delay = 1000) {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries || !this.shouldRetry(error)) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  shouldRetry(error) {
    return error.message.includes('connexion') || 
           error.message.includes('réseau') || 
           error.message.includes('timeout') ||
           error.message.includes('ERR_CONNECTION');
  }

  getAuthHeaders() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401 && this.onUnauthorized) {
        this.onUnauthorized();
      }

      const error = await response.json().catch(() => ({
        message: 'Une erreur est survenue',
      }));
      throw new Error(error.message || 'Une erreur est survenue');
    }

    return response.json();
  }

  async get(endpoint, options = {}) {
    // Check network status first
    if (!NetworkStatus.isOnline) {
      throw new Error('Pas de connexion Internet');
    }

    try {
      // Construction sécurisée de l'URL + support des query params (page, limit, sortBy, etc.)
      const url = new URL(`${this.baseURL}${endpoint}`);
      const { params, timeout = 10000 } = options || {};
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a expiré');
      }
      if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('ERR_CONNECTION')) {
        if (this.onServerUnavailable) {
          this.onServerUnavailable();
        }
        throw new Error('Problème de connexion réseau');
      }
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        if (this.onServerUnavailable) {
          this.onServerUnavailable();
        }
      }
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        if (this.onServerUnavailable) {
          this.onServerUnavailable();
        }
      }
      throw error;
    }
  }

  async patch(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        if (this.onServerUnavailable) {
          this.onServerUnavailable();
        }
      }
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        if (this.onServerUnavailable) {
          this.onServerUnavailable();
        }
      }
      throw error;
    }
  }

  async postFormData(endpoint, formData) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const headers = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        if (this.onServerUnavailable) {
          this.onServerUnavailable();
        }
      }
      throw error;
    }
  }

  async putFormData(endpoint, formData) {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const headers = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        if (this.onServerUnavailable) {
          this.onServerUnavailable();
        }
      }
      throw error;
    }
  }
}

export default new ApiService(API_URL);
