import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUnverifiedUsers } from '../../api/admin';
import { handleApiError } from '../../utils/helpers';
import '../student/Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    totalUsers: 0,
    totalReports: 0,
    pendingClaims: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUnverifiedUsers();
        setStats((prev) => ({
          ...prev,
          pendingVerifications: response.data?.length || 0,
        }));
      } catch (error) {
        toast.error(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout
      title="Ringkasan"
      description="Dashboard administrasi CaBang Perpustakaan UNDIP"
    >
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Verifikasi KTM</div>
          <div className="stat-value">{isLoading ? '—' : stats.pendingVerifications}</div>
          <div className="stat-hint">Menunggu verifikasi</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Mahasiswa</div>
          <div className="stat-value">—</div>
          <div className="stat-hint">Terdaftar</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Laporan</div>
          <div className="stat-value">—</div>
          <div className="stat-hint">Aktif</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Klaim Pending</div>
          <div className="stat-value">—</div>
          <div className="stat-hint">Menunggu verifikasi</div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
