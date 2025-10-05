import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const categoryService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },

  async create(categoryData) {
    const response = await api.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
    return response.data;
  },

  async update(id, categoryData) {
    const response = await api.put(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`, categoryData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`);
    return response.data;
  },
};
