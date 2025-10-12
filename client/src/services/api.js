import { API_URL, STORAGE_KEYS } from '../config/constants';

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
    try {
      // Construction sécurisée de l'URL + support des query params (page, limit, sortBy, etc.)
      const url = new URL(`${this.baseURL}${endpoint}`);
      const { params } = options || {};
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
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
