import api from './api';

class BadgeService {
  async getUserBadges(userId) {
    return api.get(`/api/badges/user/${userId}`);
  }

  async updateUserBadges(userId) {
    return api.post(`/api/badges/user/${userId}/update`);
  }
}

export default new BadgeService();
