import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, FileText, MapPin, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyReports } from '../../api/reports';
import { formatDate, getStorageUrl, handleApiError } from '../../utils/helpers';
import AmbientBackground from '../../components/common/AmbientBackground';
import Navbar from '../../components/common/Navbar';
import '../claims/MyClaims.css';

const statusLabel = {
  pending: 'Menunggu verifikasi admin',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  resolved: 'Selesai',
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyReports()
      .then((data) => setReports(data.data || []))
      .catch((error) => toast.error(handleApiError(error)))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="my-claims-page">
      <AmbientBackground />
      <Navbar />
      <main className="my-claims-container">
        <motion.header className="my-claims-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="my-claims-icon"><FileText size={30} /></div>
          <div>
            <h1><span className="text-gradient">My</span> Reports</h1>
            <p>Lacak status laporan barang hilang Anda.</p>
          </div>
        </motion.header>

        {isLoading ? (
          <div className="claims-loading">Memuat laporan...</div>
        ) : reports.length === 0 ? (
          <section className="claims-empty">
            <Package size={56} />
            <h2>Belum ada laporan</h2>
            <p>Laporkan barang hilang Anda di Perpustakaan UNDIP.</p>
            <Link to="/reports/create">Buat Laporan</Link>
          </section>
        ) : (
          <section className="claims-list">
            {reports.map((report, index) => (
              <motion.article
                className="claim-card"
                key={report.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                {report.photo_path ? (
                  <img src={getStorageUrl(report.photo_path)} alt={report.item_name} />
                ) : (
                  <div className="claim-image-placeholder">
                    <Package size={28} />
                  </div>
                )}
                <div className="claim-copy">
                  <div className="claim-topline">
                    <span className={`claim-status status-${report.status}`}>
                      {statusLabel[report.status] || report.status}
                    </span>
                    <span className="claim-date">
                      <Calendar size={14} /> {formatDate(report.created_at)}
                    </span>
                  </div>
                  <h2>{report.item_name}</h2>
                  <p className="report-meta-line">
                    <MapPin size={14} /> {report.location} · {report.category}
                  </p>
                  {report.status === 'rejected' && report.rejection_reason && (
                    <p className="claim-rejection">Alasan: {report.rejection_reason}</p>
                  )}
                  {report.status === 'resolved' && (
                    <p className="claim-resolved-note">Barang telah dikembalikan ke pemiliknya.</p>
                  )}
                </div>
                <Link
                  aria-label={`Lihat ${report.item_name}`}
                  className="claim-link"
                  to={`/items/${report.id}`}
                >
                  →
                </Link>
              </motion.article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default MyReports;
