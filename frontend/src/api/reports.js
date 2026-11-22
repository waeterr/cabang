import apiClient from './client';

/**
 * Get all approved reports with filters
 */
export const getReports = async (params = {}) => {
  const response = await apiClient.get('/reports', { params });
  return response.data;
};

export const getPublicStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

/**
 * Get report by ID
 */
export const getReportById = async (id) => {
  const response = await apiClient.get(`/reports/${id}`);
  return response.data;
};

/**
 * Create new report
 */
export const createReport = async (formData) => {
  const response = await apiClient.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update report
 */
export const updateReport = async (id, formData) => {
  const response = await apiClient.post(`/reports/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: { _method: 'PUT' },
  });
  return response.data;
};

/**
 * Delete report
 */
export const deleteReport = async (id) => {
  const response = await apiClient.delete(`/reports/${id}`);
  return response.data;
};

/**
 * Get user's own reports
 */
export const getMyReports = async (params = {}) => {
  const response = await apiClient.get('/reports/my/list', { params });
  return response.data;
};
