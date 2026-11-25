import apiClient from './client';

/**
 * Get notifications (inbox)
 */
export const getInbox = async (params = {}) => {
  const response = await apiClient.get('/inbox', { params });
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async () => {
  const response = await apiClient.get('/inbox/unread-count');
  return response.data;
};

/**
 * Mark one notification as read
 */
export const markNotificationRead = async (id) => {
  const response = await apiClient.put(`/inbox/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async () => {
  const response = await apiClient.put('/inbox/read-all');
  return response.data;
};

/**
 * Get the authenticated user's activity history
 */
export const getMyActivities = async (params = {}) => {
  const response = await apiClient.get('/activities/my', { params });
  return response.data;
};
