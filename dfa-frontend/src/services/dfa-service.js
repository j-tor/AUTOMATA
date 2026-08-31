import { apiClient } from './api';

export const dfaService = {
  createDFA: (dfaData) => apiClient.post('/dfa/create', dfaData),
  getDFAList: () => apiClient.get('/dfa/list'),
  getDFA: (id) => apiClient.get(`/dfa/${id}`),
  validateDFA: (id) => apiClient.post(`/dfa/validate/${id}`, {}),
  deleteDFA: (id) => apiClient.delete(`/dfa/${id}`)
};
