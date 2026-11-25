import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, ChevronRight, Package, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyClaims } from '../../api/claims';
import { formatDate, getStorageUrl, handleApiError } from '../../utils/helpers';
import AmbientBackground from '../../components/common/AmbientBackground';
import Navbar from '../../components/common/Navbar';
import ClaimChat from '../../components/common/ClaimChat';
import './MyClaims.css';

const statusLabel = {
  pending: 'Menunggu verifikasi',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyClaims()
      .then((data) => setClaims(data.data || []))
      .catch((error) => toast.error(handleApiError(error)))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="my-claims-page">
      <AmbientBackground />
      <Navbar />
      <main className="my-claims-container">
        <motion.header className="my-claims-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="my-claims-icon"><Award size={30} /></div>
          <div><h1><span className="text-gradient">My</span> Claims</h1><p>Lacak status klaim barang Anda.</p></div>
        </motion.header>

        {isLoading ? (
          <div className="claims-loading">Memuat klaim...</div>
        ) : claims.length === 0 ? (
          <section className="claims-empty">
            <Package size={56} />
            <h2>Belum ada klaim</h2>
            <p>Klaim barang temuan yang menurut Anda milik Anda.</p>
            <Link to="/items/found">Lihat barang ditemukan</Link>
          </section>
        ) : (
          <section className="claims-list">
            {claims.map((claim, index) => (
              <motion.article className="claim-card" key={claim.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                {claim.report?.photo_path ? <img src={getStorageUrl(claim.report.photo_path)} alt={claim.report.item_name} /> : <div className="claim-image-placeholder"><Package size={28} /></div>}
                <div className="claim-copy">
                  <div className="claim-topline"><span className={`claim-status status-${claim.status}`}>{statusLabel[claim.status] || claim.status}</span><span className="claim-date"><Calendar size={14} /> {formatDate(claim.created_at)}</span></div>
                  <h2>{claim.report?.item_name || 'Barang tidak tersedia'}</h2>
                  <p>{claim.proof_description}</p>
                  {claim.status === 'rejected' && claim.rejection_reason && <p className="claim-rejection">Alasan: {claim.rejection_reason}</p>}
                </div>
                <div className="claim-actions">
                  <button className="claim-chat-trigger" onClick={() => setSelectedClaim(claim)} type="button">
                    Diskusi
                  </button>
                  {claim.report && <Link aria-label={`Lihat ${claim.report.item_name}`} className="claim-link" to={`/items/${claim.report.id}`}><ChevronRight size={20} /></Link>}
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </main>

      <AnimatePresence>
        {selectedClaim && (
          <div className="modal-overlay" onClick={() => setSelectedClaim(null)}>
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button aria-label="Tutup" className="modal-close" onClick={() => setSelectedClaim(null)} type="button">
                <X size={20} />
              </button>
              <h2 className="modal-title">{selectedClaim.report?.item_name || 'Klaim'}</h2>
              <ClaimChat claimId={selectedClaim.id} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClaims;
