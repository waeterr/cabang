import apiClient from './client';

/**
 * Get all categories
 */
export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};
