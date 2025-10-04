import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const categoryService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },

  async create(name, description) {
    const response = await api.post(API_ENDPOINTS.CATEGORIES.BASE, {
      name,
      description,
    });
    return response.data;
  },
};
