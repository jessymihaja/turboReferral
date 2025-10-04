import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const serviceService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.SERVICES.BASE);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(API_ENDPOINTS.SERVICES.BY_ID(id));
    return response.data;
  },

  async create(formData) {
    const response = await api.postFormData(API_ENDPOINTS.SERVICES.BASE, formData);
    return response.data;
  },

  async update(id, formData) {
    const response = await api.putFormData(API_ENDPOINTS.SERVICES.BY_ID(id), formData);
    return response;
  },

  async delete(id) {
    const response = await api.delete(API_ENDPOINTS.SERVICES.BY_ID(id));
    return response;
  },
};
