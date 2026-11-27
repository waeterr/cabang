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

  const isClaimClosed = item?.removal_deadline_at && new Date(item.removal_deadline_at) < new Date();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    setIsLoading(true);
    try {
      const data = await getReportById(id);
      setItem(data);
    } catch (error) {
      toast.error('Gagal memuat detail barang');
      navigate('/items/lost');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = () => {
    if (isClaimClosed) {
      toast.error('Batas klaim barang ini sudah lewat');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Masuk dulu untuk mengajukan klaim');
      navigate('/login');
      return;
    }

    if (!user?.email_verified_at) {
      toast.error('Verifikasi email Anda dulu sebelum mengajukan klaim');
      navigate('/verify-email');
      return;
    }

    if (!user?.is_verified || user?.verification_status !== 'approved') {
      toast.error('Akun Anda harus terverifikasi KTM untuk mengajukan klaim');
      navigate('/verification-pending');
      return;
    }

    // Navigate to claim form
    navigate(`/claims/create/${id}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Menunggu Review', icon: AlertCircle, color: 'yellow' },
      approved: { label: 'Terverifikasi', icon: CheckCircle, color: 'cyan' },
      rejected: { label: 'Ditolak', icon: AlertCircle, color: 'red' },
      resolved: { label: 'Selesai', icon: CheckCircle, color: 'green' },
    };
    return badges[status] || badges.pending;
  };

  if (isLoading) {
    return (
      <div className="item-detail-page">
        <AmbientBackground />
        <Navbar />
        <div className="detail-container">
          <div className="detail-loading">Memuat detail barang...</div>
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
            <span>Kembali ke Barang {item.type === 'lost' ? 'Hilang' : 'Temuan'}</span>
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
                <p>Tidak ada foto</p>
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
                {item.type === 'lost' ? 'Barang Hilang' : 'Barang Temuan'}
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
                  <div className="meta-label">Lokasi</div>
                  <div className="meta-value">{item.location}</div>
                </div>
              </div>

              <div className="detail-meta-item">
                <Calendar size={20} />
                <div>
                  <div className="meta-label">Tanggal {item.type === 'lost' ? 'Hilang' : 'Ditemukan'}</div>
                  <div className="meta-value">{formatDate(item.date)}</div>
                </div>
              </div>
            </div>

            <div className="detail-description">
              <h2>Deskripsi</h2>
              <p>{item.description}</p>
            </div>

            {item.additional_info && (
              <div className="detail-additional">
                <h2>Informasi Tambahan</h2>
                <p>{item.additional_info}</p>
              </div>
            )}

            {item.removal_deadline_at && (
              <div className="detail-removal-notice">
                <Megaphone size={20} />
                <div>
                  <h2>Pemberitahuan Penghapusan</h2>
                  <p>
                    {isClaimClosed
                      ? 'Batas klaim untuk barang ini sudah lewat dan barang akan segera diarsipkan.'
                      : 'Barang ini akan dihapus dari daftar bila tidak diklaim sebelum '}
                    {!isClaimClosed && <strong>{formatDate(item.removal_deadline_at)}</strong>}
                    {!isClaimClosed && '.'}
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
                <div className="reporter-label">Dilaporkan oleh</div>
                <div className="reporter-name">{item.user?.name || 'Tidak diketahui'}</div>
              </div>
            </div>

            {item.status === 'approved' && item.type === 'found' && (
              isClaimClosed ? (
                <div className="detail-claim-closed">
                  <AlertCircle size={20} />
                  <span>Batas klaim sudah lewat. Silakan hubungi petugas perpustakaan.</span>
                </div>
              ) : (
                <div className="detail-actions">
                  <button onClick={handleClaim} className="btn-claim">
                    Klaim Barang Ini
                  </button>
                  <p className="claim-note">
                    {!isAuthenticated
                      ? 'Masuk dulu untuk mengajukan klaim'
                      : !user?.email_verified_at
                      ? 'Verifikasi email diperlukan'
                      : !user?.is_verified
                      ? 'Verifikasi KTM diperlukan'
                      : 'Pastikan barang ini benar milik Anda'}
                  </p>
                </div>
              )
            )}

            {item.status === 'resolved' && (
              <div className="detail-resolved">
                <CheckCircle size={20} />
                <span>Barang ini sudah diselesaikan</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
