import apiClient from './client';

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

export const createCategory = async (name) => {
  const response = await apiClient.post('/admin/categories', { name });
  return response.data;
};

export const updateCategory = async (id, name) => {
  const response = await apiClient.put(`/admin/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/admin/categories/${id}`);
  return response.data;
};
