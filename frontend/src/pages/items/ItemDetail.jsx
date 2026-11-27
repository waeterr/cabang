import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Package, ArrowLeft, AlertCircle, CheckCircle, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { getReportById } from '../../api/reports';
import { getStorageUrl, formatDate } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    setIsLoading(true);
    try {
      const data = await getReportById(id);
      setItem(data);
    } catch (error) {
      toast.error('Failed to load item details');
      navigate('/items/lost');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = () => {
    if (!isAuthenticated) {
      toast.error('Please login to claim this item');
      navigate('/login');
      return;
    }

    if (!user?.email_verified_at) {
      toast.error('Verifikasi email Anda dulu sebelum mengajukan klaim');
      navigate('/verify-email');
      return;
    }

    if (!user?.is_verified || user?.verification_status !== 'approved') {
      toast.error('Your account must be verified to claim items');
      navigate('/verification-pending');
      return;
    }

    // Navigate to claim form
    navigate(`/claims/create/${id}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending Review', icon: AlertCircle, color: 'yellow' },
      approved: { label: 'Verified', icon: CheckCircle, color: 'cyan' },
      rejected: { label: 'Rejected', icon: AlertCircle, color: 'red' },
      resolved: { label: 'Resolved', icon: CheckCircle, color: 'green' },
    };
    return badges[status] || badges.pending;
  };

  if (isLoading) {
    return (
      <div className="item-detail-page">
        <AmbientBackground />
        <Navbar />
        <div className="detail-container">
          <div className="detail-loading">Loading item details...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const statusBadge = getStatusBadge(item.status);

  return (
    <div className="item-detail-page">
      <AmbientBackground />
      <Navbar />

      <div className="detail-container">
        <motion.div
          className="detail-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to={`/items/${item.type}`} className="back-link">
            <ArrowLeft size={20} />
            <span>Back to {item.type === 'lost' ? 'Lost' : 'Found'} Items</span>
          </Link>
        </motion.div>

        <div className="detail-content">
          <motion.div
            className="detail-image-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {item.photo_path ? (
              <div className="detail-image-wrapper">
                <img
                  src={getStorageUrl(item.photo_path)}
                  alt={item.item_name}
                  className="detail-image"
                />
              </div>
            ) : (
              <div className="detail-image-placeholder">
                <Package size={80} />
                <p>No image available</p>
              </div>
            )}
          </motion.div>

          <motion.div
            className="detail-info-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="detail-badges">
              <span className={`detail-type-badge type-${item.type}`}>
                {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
              </span>
              <span className={`detail-status-badge status-${statusBadge.color}`}>
                <statusBadge.icon size={16} />
                {statusBadge.label}
              </span>
            </div>

            <h1 className="detail-title">{item.item_name}</h1>

            <div className="detail-category">
              <Package size={18} />
              <span>{item.category}</span>
            </div>

            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <MapPin size={20} />
                <div>
                  <div className="meta-label">Location</div>
                  <div className="meta-value">{item.location}</div>
                </div>
              </div>

              <div className="detail-meta-item">
                <Calendar size={20} />
                <div>
                  <div className="meta-label">Date {item.type === 'lost' ? 'Lost' : 'Found'}</div>
                  <div className="meta-value">{formatDate(item.date)}</div>
                </div>
              </div>
            </div>

            <div className="detail-description">
              <h2>Description</h2>
              <p>{item.description}</p>
            </div>

            {item.additional_info && (
              <div className="detail-additional">
                <h2>Additional Information</h2>
                <p>{item.additional_info}</p>
              </div>
            )}

            {item.removal_deadline_at && (
              <div className="detail-removal-notice">
                <Megaphone size={20} />
                <div>
                  <h2>Pemberitahuan Penghapusan</h2>
                  <p>
                    Barang ini akan dihapus dari daftar bila tidak diklaim sebelum{' '}
                    <strong>{formatDate(item.removal_deadline_at)}</strong>.
                  </p>
                  {item.removal_notice && <p>{item.removal_notice}</p>}
                </div>
              </div>
            )}

            <div className="detail-reporter">
              <div className="reporter-avatar">
                {item.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="reporter-info">
                <div className="reporter-label">Reported by</div>
                <div className="reporter-name">{item.user?.name || 'Unknown'}</div>
              </div>
            </div>

            {item.status === 'approved' && item.type === 'found' && (
              <div className="detail-actions">
                <button onClick={handleClaim} className="btn-claim">
                  Claim This Item
                </button>
                <p className="claim-note">
                  {!isAuthenticated
                    ? 'Login required to claim items'
                    : !user?.is_verified
                    ? 'Account verification required'
                    : 'Confirm this is your lost item'}
                </p>
              </div>
            )}

            {item.status === 'resolved' && (
              <div className="detail-resolved">
                <CheckCircle size={20} />
                <span>This item has been resolved</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
