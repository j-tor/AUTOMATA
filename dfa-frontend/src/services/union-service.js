import { apiClient } from './api';

export const unionService = {
  createUnion: (dfa1Id, dfa2Id) => 
    apiClient.post('/dfa/union', { dfa1_id: dfa1Id, dfa2_id: dfa2Id }),
  getUnion: (id) => apiClient.get(`/dfa/${id}`)
};
