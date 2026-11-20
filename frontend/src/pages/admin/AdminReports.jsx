import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, X, Eye, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminReports, approveReport, rejectReport } from '../../api/admin';
import { getStorageUrl, formatDate } from '../../utils/helpers';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import './AdminReports.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminReports({ status: filter });
      setReports(data.data || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reportId) => {
    setIsProcessing(true);
    try {
      await approveReport(reportId);
      toast.success('Report approved successfully');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error('Failed to approve report');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reportId) => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectReport(reportId, rejectionReason);
      toast.success('Report rejected');
      setSelectedReport(null);
      setRejectionReason('');
      fetchReports();
    } catch (error) {
      toast.error('Failed to reject report');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pending', class: 'status-pending' },
      approved: { label: 'Approved', class: 'status-approved' },
      rejected: { label: 'Rejected', class: 'status-rejected' },
      resolved: { label: 'Resolved', class: 'status-resolved' },
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
            <span className="text-gradient">Moderate</span> Reports
          </h1>
          <p className="reports-subtitle">
            Review dan kelola laporan barang hilang
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="filter-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {['pending', 'approved', 'rejected', 'all'].map((status) => (
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
            <h3 className="empty-title">No Reports Found</h3>
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
                    {report.type === 'lost' ? 'Lost' : 'Found'}
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

                  <div className="report-meta">
                    <div className="report-meta-item">
                      <span className="meta-label">Location:</span>
                      <span>{report.location}</span>
                    </div>
                    <div className="report-meta-item">
                      <span className="meta-label">Date:</span>
                      <span>{formatDate(report.date)}</span>
                    </div>
                    <div className="report-meta-item">
                      <span className="meta-label">Reported by:</span>
                      <span>{report.user?.name}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReport(report)}
                  className="btn-view-report"
                >
                  <Eye size={18} />
                  <span>Review Report</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

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

            <h2 className="modal-title">Review Report</h2>

            <div className="modal-report-info">
              <div className="info-row">
                <span className="info-label">Item:</span>
                <span className="info-value">{selectedReport.item_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Category:</span>
                <span className="info-value">{selectedReport.category}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Type:</span>
                <span className={`report-type ${selectedReport.type}`}>
                  {selectedReport.type === 'lost' ? 'Lost' : 'Found'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">{selectedReport.location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date:</span>
                <span className="info-value">{formatDate(selectedReport.date)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Reported by:</span>
                <span className="info-value">{selectedReport.user?.name}</span>
              </div>
            </div>

            <div className="modal-description">
              <h3>Description:</h3>
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

            {selectedReport.status === 'pending' && (
              <div className="modal-actions">
                <button
                  onClick={() => handleApprove(selectedReport.id)}
                  disabled={isProcessing}
                  className="btn-approve"
                >
                  <Check size={18} />
                  <span>{isProcessing ? 'Processing...' : 'Approve'}</span>
                </button>

                <details className="reject-details">
                  <summary>
                    <X size={16} />
                    <span>Reject Report</span>
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
                      onClick={() => handleReject(selectedReport.id)}
                      disabled={isProcessing || !rejectionReason.trim()}
                      className="btn-reject"
                    >
                      Reject with Reason
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
