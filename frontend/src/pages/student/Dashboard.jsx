import AppLayout from '../../components/layout/AppLayout';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <AppLayout
      title="Beranda"
      description="Selamat datang di CaBang, platform barang hilang Perpustakaan UNDIP"
    >
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Laporan</div>
          <div className="stat-value">—</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Barang Ditemukan</div>
          <div className="stat-value">—</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Klaim Aktif</div>
          <div className="stat-value">—</div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
