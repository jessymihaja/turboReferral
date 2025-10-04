import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const referralService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.REFERRALS.BASE);
    return response.data;
  },

  async getByService(serviceId) {
    const response = await api.get(API_ENDPOINTS.REFERRALS.BY_SERVICE(serviceId));
    return response.data;
  },

  async getByUser(userId) {
    const response = await api.get(API_ENDPOINTS.REFERRALS.BY_USER(userId));
    return response.data;
  },

  async getWithPromoStatus() {
    const response = await api.get(API_ENDPOINTS.REFERRALS.WITH_STATUS);
    return response.data;
  },

  async create(referralData) {
    const response = await api.post(API_ENDPOINTS.REFERRALS.BASE, referralData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`${API_ENDPOINTS.REFERRALS.BASE}/${id}`);
    return response.data;
  },
};
