import { ClaimsSearchRequest, ClaimsSearchResponse } from '../types/claims';
import { http } from './http';

export const claimsService = {
  search(payload: ClaimsSearchRequest) {
    return http<ClaimsSearchResponse>('/api/claims/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
