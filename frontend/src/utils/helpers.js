/**
 * Format date to Indonesian locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date to short format
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format datetime with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hari yang lalu")
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  
  return formatDate(dateString);
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Format file size to readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get storage URL for images
 */
export const getStorageUrl = (path) => {
  if (!path) return null;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}/storage/${path}`;
};

/**
 * Handle API error and return user-friendly message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Validation errors
    if (error.response.status === 422 && error.response.data.errors) {
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
    
    // Other error messages
    return error.response.data.message || 'Terjadi kesalahan';
  } else if (error.request) {
    return 'Tidak dapat terhubung ke server';
  } else {
    return error.message || 'Terjadi kesalahan';
  }
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
