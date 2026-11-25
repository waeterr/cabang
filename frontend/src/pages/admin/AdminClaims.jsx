import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Check, Eye, FileText, Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { approveClaim, getAdminClaims, rejectClaim } from '../../api/admin';
import { formatDate, getStorageUrl, handleApiError } from '../../utils/helpers';
import AmbientBackground from '../../components/common/AmbientBackground';
import Navbar from '../../components/common/Navbar';
import Pagination from '../../components/common/Pagination';
import ClaimChat from '../../components/common/ClaimChat';
import './AdminReports.css';

const statusLabel = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [meta, setMeta] = useState(null);

  const fetchClaims = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAdminClaims({
        ...(filter === 'all' ? {} : { status: filter }),
        page,
      });
      setClaims(data.data || []);
      setMeta(data);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const closeModal = () => {
    setSelectedClaim(null);
    setRejectionReason('');
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveClaim(selectedClaim.id);
      toast.success('Klaim disetujui. Laporan barang ditandai selesai.');
      closeModal();
      fetchClaims();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }
    setIsProcessing(true);
    try {
      await rejectClaim(selectedClaim.id, rejectionReason);
      toast.success('Klaim ditolak');
      closeModal();
      fetchClaims();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="admin-reports-page">
      <AmbientBackground />
      <Navbar />
      <main className="admin-reports-container">
        <motion.header className="reports-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="header-icon"><Award size={32} /></div>
          <h1 className="reports-title"><span className="text-gradient">Verify</span> Claims</h1>
          <p className="reports-subtitle">Tinjau bukti kepemilikan sebelum barang diserahkan.</p>
        </motion.header>
        <div className="filter-tabs">
          {['pending', 'approved', 'rejected', 'all'].map((status) => <button className={`filter-tab ${filter === status ? 'active' : ''}`} key={status} onClick={() => setFilter(status)}>{statusLabel[status] || 'All'}</button>)}
        </div>

        {isLoading ? <div className="loading-grid">{[1, 2, 3].map((item) => <div className="report-skeleton" key={item} />)}</div> : claims.length === 0 ? (
          <div className="empty-state"><Award size={64} /><h2 className="empty-title">No Claims Found</h2><p className="empty-description">Tidak ada klaim dengan status ini.</p></div>
        ) : (
          <div className="reports-grid">
            {claims.map((claim, index) => (
              <motion.article className="report-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={claim.id} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}>
                <div className="report-header"><span className={`report-status status-${claim.status}`}>{statusLabel[claim.status]}</span><span className="report-category">{formatDate(claim.created_at)}</span></div>
                {claim.report?.photo_path && <div className="report-image-preview"><img alt={claim.report.item_name} src={getStorageUrl(claim.report.photo_path)} /></div>}
                <div className="report-body"><h2 className="report-name">{claim.report?.item_name || 'Barang dihapus'}</h2><p className="report-description">{claim.proof_description}</p><div className="report-meta"><div className="report-meta-item"><span className="meta-label">Claimant:</span><span>{claim.user?.name}</span></div><div className="report-meta-item"><span className="meta-label">Contact:</span><span>{claim.contact_info}</span></div></div></div>
                <button className="btn-view-report" onClick={() => setSelectedClaim(claim)}><Eye size={18} /> Review Claim</button>
              </motion.article>
            ))}
          </div>
        )}

        <Pagination
          meta={meta}
          onPageChange={(page) => {
            fetchClaims(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {selectedClaim && <div className="modal-overlay" onClick={closeModal}><motion.div className="modal-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(event) => event.stopPropagation()}><button aria-label="Tutup" className="modal-close" onClick={closeModal}><X size={20} /></button><h2 className="modal-title">Review Claim</h2><div className="modal-report-info"><div className="info-row"><span className="info-label">Barang:</span><span className="info-value">{selectedClaim.report?.item_name}</span></div><div className="info-row"><span className="info-label">Pengklaim:</span><span className="info-value">{selectedClaim.user?.name}</span></div><div className="info-row"><span className="info-label">Kontak:</span><span className="info-value">{selectedClaim.contact_info}</span></div></div><div className="modal-description"><h3>Detail bukti</h3><p>{selectedClaim.proof_description}</p></div>{selectedClaim.proof_path && <a className="claim-proof-link" href={getStorageUrl(selectedClaim.proof_path)} rel="noreferrer" target="_blank"><FileText size={18} /> Buka bukti pendukung</a>}<ClaimChat claimId={selectedClaim.id} />{selectedClaim.status === 'pending' && <div className="modal-actions"><button className="btn-approve" disabled={isProcessing} onClick={handleApprove}><Check size={18} />{isProcessing ? 'Memproses...' : 'Setujui Klaim'}</button><details className="reject-details"><summary><X size={16} /> Tolak Klaim</summary><div className="reject-form"><textarea className="reject-textarea" onChange={(event) => setRejectionReason(event.target.value)} placeholder="Alasan penolakan" rows={3} value={rejectionReason} /><button className="btn-reject" disabled={isProcessing || !rejectionReason.trim()} onClick={handleReject}>Tolak dengan Alasan</button></div></details></div>}</motion.div></div>}
    </div>
  );
};

export default AdminClaims;
