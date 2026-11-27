import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, FileText, Shield, Tag, UserCheck, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { getDashboardStats, getUnverifiedUsers } from '../../api/admin';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import '../student/Dashboard.css';

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    pendingKtm: 0,
    totalUsers: 0,
    totalReports: 0,
    pendingClaims: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUnverifiedUsers(), getDashboardStats()])
      .then(([usersData, statsData]) => {
        setStats({
          pendingKtm: usersData.data?.length || 0,
          totalUsers: statsData.users?.total || 0,
          totalReports: statsData.reports?.total || 0,
          pendingClaims: statsData.claims?.pending || 0,
        });
      })
      .catch(() => toast.error('Gagal memuat data dasbor'))
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    { label: 'KTM Menunggu', value: stats.pendingKtm, icon: UserCheck, color: 'blue' },
    { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'cyan' },
    { label: 'Total Laporan', value: stats.totalReports, icon: FileText, color: 'yellow' },
    { label: 'Klaim Menunggu', value: stats.pendingClaims, icon: Award, color: 'green' },
  ];

  const actions = [
    { icon: UserCheck, label: 'Verifikasi KTM', description: 'Verifikasi mahasiswa baru', to: '/admin/verifications', color: 'blue' },
    { icon: FileText, label: 'Moderasi Laporan', description: 'Kelola laporan masuk', to: '/admin/reports', color: 'cyan' },
    { icon: Award, label: 'Verifikasi Klaim', description: 'Verifikasi klaim barang', to: '/admin/claims', color: 'violet' },
    { icon: Users, label: 'Kelola Pengguna', description: 'Kelola mahasiswa', to: '/admin/users', color: 'green' },
    { icon: Tag, label: 'Kelola Kategori', description: 'Atur kategori barang', to: '/admin/categories', color: 'blue' },
  ];

  return (
    <div className="dashboard-page">
      <AmbientBackground />
      <Navbar />
      <div className="dashboard-container">
        <motion.div className="dashboard-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="dashboard-title">Dasbor <span className="text-gradient">Admin</span></h1>
            <p className="dashboard-subtitle">Kelola verifikasi dan laporan CaBang, {user?.name}</p>
          </div>
          <Shield className="dashboard-admin-mark" size={34} />
        </motion.div>

        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div key={stat.label} className={`stat-card stat-${stat.color}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} whileHover={{ y: -4 }}>
              <div className="stat-icon-wrapper"><stat.icon className="stat-icon" size={24} /></div>
              <div className="stat-content"><div className="stat-value">{isLoading ? '—' : stat.value}</div><div className="stat-label">{stat.label}</div></div>
            </motion.div>
          ))}
        </div>

        <motion.section className="section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="section-title">Aksi Cepat</h2>
          <div className="actions-grid">
            {actions.map((action, index) => (
              <motion.div key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + index * 0.08 }} whileHover={{ y: -4 }}>
                <Link to={action.to} className={`action-card action-${action.color}`}>
                  <div className="action-icon"><action.icon size={28} /></div>
                  <div className="action-content"><h3 className="action-label">{action.label}</h3><p className="action-description">{action.description}</p></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AdminDashboard;
