import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const notificationService = {
  async getAll(page = 1, limit = 10) {
    const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUnreadCount() {
    try {
      const response = await api.retry(async () => {
        return await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT, { timeout: 5000 });
      });
      return response.data;
    } catch (error) {
      console.warn('Échec de récupération du nombre de notifications:', error.message);
      return { count: 0 };
    }
  },

  async markAsRead(id) {
    const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return response.data;
  },
};
