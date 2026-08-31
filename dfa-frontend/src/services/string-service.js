import { apiClient } from './api';

export const stringService = {
  testString: (dfa1Id, dfa2Id, unionDfaId, string) =>
    apiClient.post('/dfa/test-string', { 
      dfa1_id: dfa1Id, 
      dfa2_id: dfa2Id, 
      union_dfa_id: unionDfaId, 
      string 
    })
};
