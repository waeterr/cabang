export const REPORT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};

export const REPORT_TYPE = {
  LOST: 'lost',
  FOUND: 'found',
};

export const CLAIM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const USER_ROLE = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  resolved: 'bg-blue-100 text-blue-800',
};

export const STATUS_LABELS = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  resolved: 'Selesai',
};

export const TYPE_LABELS = {
  lost: 'Barang Hilang',
  found: 'Barang Ditemukan',
};

export const CATEGORIES = [
  'Elektronik',
  'Aksesoris',
  'Dokumen',
  'Pakaian',
  'Alat Tulis',
  'Kunci',
  'Lainnya',
];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];
