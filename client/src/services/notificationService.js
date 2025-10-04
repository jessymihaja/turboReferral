import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const notificationService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return response.data;
  },
};
