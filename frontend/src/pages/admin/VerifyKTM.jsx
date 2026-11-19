import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, X, Check, AlertCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUnverifiedUsers, verifyUser, rejectUser } from '../../api/admin';
import { getStorageUrl, formatDate } from '../../utils/helpers';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import './VerifyKTM.css';

const VerifyKTM = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUnverified();
  }, []);

  const fetchUnverified = async () => {
    setIsLoading(true);
    try {
      const data = await getUnverifiedUsers();
      setUsers(data.data || []);
    } catch (error) {
      toast.error('Failed to load pending verifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    setIsProcessing(true);
    try {
      await verifyUser(userId);
      toast.success('KTM verified successfully');
      setSelectedUser(null);
      fetchUnverified();
    } catch (error) {
      toast.error('Failed to verify KTM');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectUser(userId, rejectionReason);
      toast.success('KTM rejected. User can re-upload.');
      setSelectedUser(null);
      setRejectionReason('');
      fetchUnverified();
    } catch (error) {
      toast.error('Failed to reject KTM');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="verify-page">
      <AmbientBackground />
      <Navbar />

      <div className="verify-container">
        <motion.div
          className="verify-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-icon">
            <UserCheck size={32} />
          </div>
          <h1 className="verify-title">
            <span className="text-gradient">Verify</span> KTM
          </h1>
          <p className="verify-subtitle">
            Verifikasi identitas mahasiswa melalui KTM
          </p>
        </motion.div>

        {isLoading ? (
          <div className="loading-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="user-skeleton" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UserCheck size={64} />
            <h3 className="empty-title">All KTM Verified</h3>
            <p className="empty-description">
              Tidak ada mahasiswa yang menunggu verifikasi saat ini
            </p>
          </motion.div>
        ) : (
          <div className="users-grid">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                className="user-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-nim mono">{user.nim}</p>
                  <p className="user-email">{user.email}</p>
                  <p className="user-date">
                    Registered {formatDate(user.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="btn-view-ktm"
                >
                  <Eye size={18} />
                  <span>View KTM</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedUser(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h2 className="modal-title">Verify KTM</h2>

              <div className="modal-user">
                <div className="user-avatar large">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{selectedUser.name}</h3>
                  <p className="mono">{selectedUser.nim}</p>
                  <p>{selectedUser.email}</p>
                </div>
              </div>

              <div className="ktm-preview">
                {selectedUser.ktm_path?.endsWith('.pdf') ? (
                  <div className="pdf-placeholder">
                    <span className="pdf-icon">📄</span>
                    <p>PDF File</p>
                    <a
                      href={getStorageUrl(selectedUser.ktm_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdf-link"
                    >
                      Open PDF →
                    </a>
                  </div>
                ) : (
                  <img
                    src={getStorageUrl(selectedUser.ktm_path)}
                    alt="KTM"
                    className="ktm-image"
                  />
                )}
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => handleVerify(selectedUser.id)}
                  disabled={isProcessing}
                  className="btn-approve"
                >
                  <Check size={18} />
                  <span>{isProcessing ? 'Processing...' : 'Approve KTM'}</span>
                </button>

                <details className="reject-details">
                  <summary>
                    <AlertCircle size={16} />
                    <span>Reject KTM</span>
                  </summary>
                  <div className="reject-form">
                    <textarea
                      placeholder="Reason for rejection (required)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="reject-textarea"
                    />
                    <button
                      onClick={() => handleReject(selectedUser.id)}
                      disabled={isProcessing || !rejectionReason.trim()}
                      className="btn-reject"
                    >
                      Reject with Reason
                    </button>
                  </div>
                </details>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerifyKTM;
