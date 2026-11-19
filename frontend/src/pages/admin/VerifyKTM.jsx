import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUnverifiedUsers, verifyUser, rejectUser } from '../../api/admin';
import { handleApiError, getStorageUrl, formatDate } from '../../utils/helpers';
import './VerifyKTM.css';

const VerifyKTM = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUnverified = async () => {
    setIsLoading(true);
    try {
      const response = await getUnverifiedUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverified();
  }, []);

  const handleVerify = async (userId) => {
    setIsProcessing(true);
    try {
      await verifyUser(userId);
      toast.success('KTM berhasil diverifikasi.');
      setSelectedUser(null);
      fetchUnverified();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason.trim()) {
      toast.error('Alasan penolakan wajib diisi.');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectUser(userId, rejectionReason);
      toast.success('KTM ditolak. Mahasiswa dapat mengunggah ulang.');
      setSelectedUser(null);
      setRejectionReason('');
      fetchUnverified();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout
      title="Verifikasi KTM"
      description="Verifikasi identitas mahasiswa melalui Kartu Tanda Mahasiswa"
    >
      {isLoading ? (
        <div className="verify-loading">Memuat data...</div>
      ) : users.length === 0 ? (
        <div className="verify-empty">
          <span className="empty-icon">✓</span>
          <p className="empty-title">Semua KTM sudah diverifikasi</p>
          <p className="empty-text">Tidak ada mahasiswa yang menunggu verifikasi saat ini.</p>
        </div>
      ) : (
        <div className="verify-grid">
          {users.map((user) => (
            <div className="verify-card" key={user.id}>
              <div className="verify-card-header">
                <div className="verify-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="verify-user-info">
                  <strong>{user.name}</strong>
                  <span className="mono">{user.nim}</span>
                  <span className="verify-email">{user.email}</span>
                </div>
              </div>

              <div className="verify-meta">
                <span>Mendaftar {formatDate(user.created_at)}</span>
              </div>

              <div className="verify-actions">
                <button
                  className="btn-view"
                  onClick={() => setSelectedUser(user)}
                  type="button"
                >
                  Lihat KTM
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              aria-label="Tutup"
              className="modal-close"
              onClick={() => setSelectedUser(null)}
              type="button"
            >
              ✕
            </button>

            <h2 className="modal-title">Verifikasi KTM</h2>

            <div className="modal-user">
              <div className="verify-avatar">{selectedUser.name.charAt(0).toUpperCase()}</div>
              <div>
                <strong>{selectedUser.name}</strong>
                <span className="mono">{selectedUser.nim}</span>
                <span>{selectedUser.email}</span>
              </div>
            </div>

            <div className="ktm-preview-large">
              {selectedUser.ktm_path?.endsWith('.pdf') ? (
                <div className="pdf-viewer">
                  <span className="pdf-icon-large">📄</span>
                  <p>File PDF</p>
                  <a
                    href={getStorageUrl(selectedUser.ktm_path)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Buka PDF di tab baru →
                  </a>
                </div>
              ) : (
                <img alt="KTM" src={getStorageUrl(selectedUser.ktm_path)} />
              )}
            </div>

            <div className="modal-actions-stack">
              <button
                className="btn btn-primary"
                disabled={isProcessing}
                onClick={() => handleVerify(selectedUser.id)}
                type="button"
              >
                {isProcessing ? 'Memproses...' : 'Setujui KTM'}
              </button>

              <details className="rejection-details">
                <summary>Tolak KTM</summary>
                <textarea
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Alasan penolakan (wajib diisi)"
                  rows={3}
                  value={rejectionReason}
                />
                <button
                  className="btn-reject"
                  disabled={isProcessing || !rejectionReason.trim()}
                  onClick={() => handleReject(selectedUser.id)}
                  type="button"
                >
                  {isProcessing ? 'Memproses...' : 'Tolak dengan Alasan'}
                </button>
              </details>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default VerifyKTM;
