import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, X, Eye, Archive, ArchiveRestore, Plus, Megaphone, BellOff, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAdminReports, approveReport, rejectReport, archiveReport, restoreReport, setRemovalNotice, clearRemovalNotice, deleteAdminReport } from '../../api/admin';
import { getStorageUrl, formatDate } from '../../utils/helpers';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import Pagination from '../../components/common/Pagination';
import './AdminReports.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [archiveNote, setArchiveNote] = useState('');
  const [removalDeadline, setRemovalDeadline] = useState('');
  const [removalNote, setRemovalNote] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    fetchReports(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchReports = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAdminReports({
        ...(filter === 'all' || filter === 'archived' ? {} : { status: filter }),
        ...(filter === 'archived' ? { archived: 'only' } : {}),
        page,
      });
      setReports(data.data || []);
      setMeta(data);
    } catch (error) {
      toast.error('Gagal memuat laporan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reportId) => {
    setIsProcessing(true);
    try {
      await approveReport(reportId);
      toast.success('Laporan disetujui');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error('Gagal menyetujui laporan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reportId) => {
    if (!rejectionReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectReport(reportId, rejectionReason);
      toast.success('Laporan ditolak');
      setSelectedReport(null);
      setRejectionReason('');
      fetchReports();
    } catch (error) {
      toast.error('Gagal menolak laporan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async (reportId) => {
    setIsProcessing(true);
    try {
      await archiveReport(reportId, archiveNote || null);
      toast.success('Laporan diarsipkan');
      setSelectedReport(null);
      setArchiveNote('');
      fetchReports();
    } catch (error) {
      toast.error('Gagal mengarsipkan laporan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async (reportId) => {
    setIsProcessing(true);
    try {
      await restoreReport(reportId);
      toast.success('Laporan dipulihkan');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error('Gagal memulihkan laporan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetRemovalNotice = async (reportId) => {
    if (!removalDeadline) {
      toast.error('Tenggat wajib diisi');
      return;
    }
    setIsProcessing(true);
    try {
      await setRemovalNotice(reportId, removalDeadline, removalNote || null);
      toast.success('Pengumuman penghapusan dipasang');
      setSelectedReport(null);
      setRemovalDeadline('');
      setRemovalNote('');
      fetchReports();
    } catch (error) {
      toast.error('Gagal memasang pengumuman');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearRemovalNotice = async (reportId) => {
    setIsProcessing(true);
    try {
      await clearRemovalNotice(reportId);
      toast.success('Pengumuman penghapusan dibatalkan');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error('Gagal membatalkan pengumuman');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (deleteConfirm !== 'HAPUS') {
      toast.error('Ketik HAPUS untuk konfirmasi');
      return;
    }

    setIsProcessing(true);
    try {
      await deleteAdminReport(reportId);
      toast.success('Laporan dihapus permanen');
      setSelectedReport(null);
      setDeleteConfirm('');
      fetchReports();
    } catch (error) {
      toast.error('Gagal menghapus laporan');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Menunggu', class: 'status-pending' },
      approved: { label: 'Disetujui', class: 'status-approved' },
      rejected: { label: 'Ditolak', class: 'status-rejected' },
      resolved: { label: 'Selesai', class: 'status-resolved' },
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="admin-reports-page">
      <AmbientBackground />
      <Navbar />

      <div className="admin-reports-container">
        <motion.div
          className="reports-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-icon">
            <FileText size={32} />
          </div>
          <h1 className="reports-title">
            <span className="text-gradient">Moderasi</span> Laporan
          </h1>
          <p className="reports-subtitle">
            Tinjau dan kelola laporan barang hilang serta temuan
          </p>
          <Link className="admin-create-found" to="/admin/reports/found/create"><Plus size={18} /> Tambah Barang Ditemukan</Link>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="filter-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {['pending', 'approved', 'rejected', 'all', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Reports List */}
        {isLoading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="report-skeleton" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FileText size={64} />
            <h3 className="empty-title">Belum Ada Laporan</h3>
            <p className="empty-description">
              Tidak ada laporan dengan status {filter}
            </p>
          </motion.div>
        ) : (
          <div className="reports-grid">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                className="report-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="report-header">
                  <div className={`report-type ${report.type}`}>
                    {report.type === 'lost' ? 'Hilang' : 'Temuan'}
                  </div>
                  <div className={`report-status ${getStatusBadge(report.status).class}`}>
                    {getStatusBadge(report.status).label}
                  </div>
                </div>

                {report.photo_path && (
                  <div className="report-image-preview">
                    <img
                      src={getStorageUrl(report.photo_path)}
                      alt={report.item_name}
                    />
                  </div>
                )}

                <div className="report-body">
                  <h3 className="report-name">{report.item_name}</h3>
                  <p className="report-category">{report.category}</p>
                  <p className="report-description">{report.description}</p>
                  {report.removal_deadline_at && <p className="removal-notice-chip"><Megaphone size={14} /> Diumumkan hingga {formatDate(report.removal_deadline_at)}</p>}

                  <div className="report-meta">
                    <div className="report-meta-item">
                      <span className="meta-label">Lokasi:</span>
                      <span>{report.location}</span>
                    </div>
                    <div className="report-meta-item">
                      <span className="meta-label">Tanggal:</span>
                      <span>{formatDate(report.date)}</span>
                    </div>
                    <div className="report-meta-item">
                      <span className="meta-label">Pelapor:</span>
                      <span>{report.user?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="report-actions">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="btn-view-report"
                  >
                    <Eye size={18} />
                    <span>Tinjau Laporan</span>
                  </button>
                  <button
                    className="btn-archive-report"
                    disabled={isProcessing}
                    onClick={() => (report.archived_at ? handleRestore(report.id) : handleArchive(report.id))}
                    title={report.archived_at ? 'Pulihkan laporan' : 'Arsipkan laporan'}
                    type="button"
                  >
                    {report.archived_at ? <ArchiveRestore size={18} /> : <Archive size={18} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Pagination meta={meta} onPageChange={(page) => { fetchReports(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedReport(null)}
            >
              <X size={20} />
            </button>

            <h2 className="modal-title">Tinjau Laporan</h2>

            <div className="modal-report-info">
              <div className="info-row">
                <span className="info-label">Barang:</span>
                <span className="info-value">{selectedReport.item_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Kategori:</span>
                <span className="info-value">{selectedReport.category}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Jenis:</span>
                <span className={`report-type ${selectedReport.type}`}>
                  {selectedReport.type === 'lost' ? 'Hilang' : 'Temuan'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Lokasi:</span>
                <span className="info-value">{selectedReport.location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tanggal:</span>
                <span className="info-value">{formatDate(selectedReport.date)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Pelapor:</span>
                <span className="info-value">{selectedReport.user?.name}</span>
              </div>
            </div>

            <div className="modal-description">
              <h3>Deskripsi:</h3>
              <p>{selectedReport.description}</p>
            </div>

            {selectedReport.photo_path && (
              <div className="modal-photo">
                <img
                  src={getStorageUrl(selectedReport.photo_path)}
                  alt={selectedReport.item_name}
                />
              </div>
            )}

            <div className="archive-report-form">
              {selectedReport.archived_at ? (
                <button className="btn-restore-report" disabled={isProcessing} onClick={() => handleRestore(selectedReport.id)} type="button"><ArchiveRestore size={18} /> Pulihkan Laporan</button>
              ) : (
                <>
                  <input className="archive-note-input" maxLength="500" onChange={(event) => setArchiveNote(event.target.value)} placeholder="Catatan pengarsipan (opsional)" value={archiveNote} />
                  <button className="btn-archive-report" disabled={isProcessing} onClick={() => handleArchive(selectedReport.id)} type="button"><Archive size={18} /> Arsipkan Laporan</button>
                </>
              )}
            </div>

            {selectedReport.type === 'found' && selectedReport.status === 'approved' && !selectedReport.archived_at && (
              <section className="removal-notice-form">
                <h3><Megaphone size={18} /> Pengumuman penghapusan publik</h3>
                <p>Ditampilkan pada barang temuan agar pengunjung dapat mengajukan klaim sebelum tenggat.</p>
                {selectedReport.removal_deadline_at ? (
                  <>
                    <p className="removal-notice-active">Aktif hingga {formatDate(selectedReport.removal_deadline_at)}</p>
                    <button className="btn-clear-removal-notice" disabled={isProcessing} onClick={() => handleClearRemovalNotice(selectedReport.id)} type="button"><BellOff size={18} /> Batalkan Pengumuman</button>
                  </>
                ) : (
                  <>
                    <label htmlFor="removal-deadline">Batas klaim</label>
                    <input id="removal-deadline" min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} onChange={(event) => setRemovalDeadline(event.target.value)} type="date" value={removalDeadline} />
                    <label htmlFor="removal-note">Catatan publik (opsional)</label>
                    <textarea id="removal-note" maxLength="500" onChange={(event) => setRemovalNote(event.target.value)} placeholder="Contoh: Barang akan diserahkan sesuai kebijakan perpustakaan setelah tenggat." rows={3} value={removalNote} />
                    <button className="btn-set-removal-notice" disabled={isProcessing || !removalDeadline} onClick={() => handleSetRemovalNotice(selectedReport.id)} type="button"><Megaphone size={18} /> Umumkan Penghapusan</button>
                  </>
                )}
              </section>
            )}

            {selectedReport.archived_at && (
              <details className="delete-details">
                <summary className="delete-summary"><Trash2 size={16} /> Hapus Permanen</summary>
                <div className="delete-form">
                  <p className="delete-warning">Tindakan ini tidak dapat dibatalkan. Gunakan hanya untuk laporan yang salah atau duplikat.</p>
                  <label htmlFor="delete-confirm">Ketik <strong>HAPUS</strong> untuk konfirmasi</label>
                  <input className="delete-confirm-input" id="delete-confirm" onChange={(event) => setDeleteConfirm(event.target.value)} placeholder="HAPUS" type="text" value={deleteConfirm} />
                  <button className="btn-delete" disabled={isProcessing || deleteConfirm !== 'HAPUS'} onClick={() => handleDelete(selectedReport.id)} type="button"><Trash2 size={18} /> Hapus Permanen</button>
                </div>
              </details>
            )}

            {selectedReport.status === 'pending' && (
              <div className="modal-actions">
                <button
                  onClick={() => handleApprove(selectedReport.id)}
                  disabled={isProcessing}
                  className="btn-approve"
                >
                  <Check size={18} />
                  <span>{isProcessing ? 'Memproses...' : 'Setujui'}</span>
                </button>

                <details className="reject-details">
                  <summary>
                    <X size={16} />
                    <span>Tolak Laporan</span>
                  </summary>
                  <div className="reject-form">
                    <textarea
                      placeholder="Alasan penolakan (wajib)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="reject-textarea"
                    />
                    <button
                      onClick={() => handleReject(selectedReport.id)}
                      disabled={isProcessing || !rejectionReason.trim()}
                      className="btn-reject"
                    >
                      Tolak dengan Alasan
                    </button>
                  </div>
                </details>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
