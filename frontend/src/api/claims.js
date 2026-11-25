import apiClient from './client';

/**
 * Get all claims (admin only)
 */
export const getClaims = async (params = {}) => {
  const response = await apiClient.get('/claims', { params });
  return response.data;
};

/**
 * Get claim by ID
 */
export const getClaimById = async (id) => {
  const response = await apiClient.get(`/claims/${id}`);
  return response.data;
};

/**
 * Create new claim
 */
export const createClaim = async (formData) => {
  const response = await apiClient.post('/claims', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update claim
 */
export const updateClaim = async (id, formData) => {
  const response = await apiClient.post(`/claims/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: { _method: 'PUT' },
  });
  return response.data;
};

/**
 * Delete claim
 */
export const deleteClaim = async (id) => {
  const response = await apiClient.delete(`/claims/${id}`);
  return response.data;
};

/**
 * Get user's own claims
 */
export const getMyClaims = async (params = {}) => {
  const response = await apiClient.get('/claims/my/list', { params });
  return response.data;
};

export const getClaimMessages = async (id) => {
  const response = await apiClient.get(`/claims/${id}/messages`);
  return response.data;
};

export const sendClaimMessage = async (id, message) => {
  const response = await apiClient.post(`/claims/${id}/messages`, { message });
  return response.data;
};
