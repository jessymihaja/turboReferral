import api from './api';
import { API_ENDPOINTS } from '../config/constants';

export const voteService = {
  async submitVote(referralId, vote, comment = '') {
    const response = await api.post(API_ENDPOINTS.VOTES.SUBMIT(referralId), {
      vote,
      comment,
    });
    return response.data;
  },

  async getComments(referralId) {
    const response = await api.get(API_ENDPOINTS.VOTES.COMMENTS(referralId));
    return response.data;
  },

  async getAllAverages() {
    const response = await api.get(API_ENDPOINTS.VOTES.AVERAGES);
    return response.data;
  },

  async getAverage(referralId) {
    const response = await api.get(API_ENDPOINTS.VOTES.AVERAGE_BY_ID(referralId));
    return response.data;
  },
};
