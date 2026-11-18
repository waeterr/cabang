import apiClient from './client';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response.data;
};

/**
 * Get all users
 */
export const getUsers = async (params = {}) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

/**
 * Get unverified users
 */
export const getUnverifiedUsers = async () => {
  const response = await apiClient.get('/admin/users/unverified');
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data;
};

/**
 * Verify user KTM
 */
export const verifyUser = async (id) => {
  const response = await apiClient.post(`/admin/users/${id}/verify`);
  return response.data;
};

/**
 * Reject user KTM
 */
export const rejectUser = async (id, rejectionReason) => {
  const response = await apiClient.post(`/admin/users/${id}/reject`, {
    rejection_reason: rejectionReason,
  });
  return response.data;
};

/**
 * Deactivate user
 */
export const deactivateUser = async (id) => {
  const response = await apiClient.put(`/admin/users/${id}/deactivate`);
  return response.data;
};

/**
 * Activate user
 */
export const activateUser = async (id) => {
  const response = await apiClient.put(`/admin/users/${id}/activate`);
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

/**
 * Get all reports (admin)
 */
export const getAdminReports = async (params = {}) => {
  const response = await apiClient.get('/admin/reports', { params });
  return response.data;
};

/**
 * Get pending reports
 */
export const getPendingReports = async () => {
  const response = await apiClient.get('/admin/reports/pending/list');
  return response.data;
};

/**
 * Approve report
 */
export const approveReport = async (id) => {
  const response = await apiClient.post(`/admin/reports/${id}/approve`);
  return response.data;
};

/**
 * Reject report
 */
export const rejectReport = async (id, rejectionReason) => {
  const response = await apiClient.post(`/admin/reports/${id}/reject`, {
    rejection_reason: rejectionReason,
  });
  return response.data;
};

/**
 * Resolve report
 */
export const resolveReport = async (id) => {
  const response = await apiClient.post(`/admin/reports/${id}/resolve`);
  return response.data;
};

/**
 * Delete report (admin)
 */
export const deleteAdminReport = async (id) => {
  const response = await apiClient.delete(`/admin/reports/${id}`);
  return response.data;
};

/**
 * Get all claims (admin)
 */
export const getAdminClaims = async (params = {}) => {
  const response = await apiClient.get('/admin/claims', { params });
  return response.data;
};

/**
 * Get pending claims
 */
export const getPendingClaims = async () => {
  const response = await apiClient.get('/admin/claims/pending/list');
  return response.data;
};

/**
 * Approve claim
 */
export const approveClaim = async (id) => {
  const response = await apiClient.post(`/admin/claims/${id}/approve`);
  return response.data;
};

/**
 * Reject claim
 */
export const rejectClaim = async (id, rejectionReason) => {
  const response = await apiClient.post(`/admin/claims/${id}/reject`, {
    rejection_reason: rejectionReason,
  });
  return response.data;
};

/**
 * Delete claim (admin)
 */
export const deleteAdminClaim = async (id) => {
  const response = await apiClient.delete(`/admin/claims/${id}`);
  return response.data;
};
