import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, UserCheck, FileText, Award, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { getUnverifiedUsers } from '../../api/admin';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import '../student/Dashboard.css';

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
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
        const data = await getUnverifiedUsers();
        setStats((prev) => ({
          ...prev,
          pendingVerifications: data.data?.length || 0,
        }));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      icon: UserCheck,
      label: 'Verify KTM',
      description: 'Verifikasi mahasiswa baru',
      to: '/admin/verifications',
      color: 'blue',
      count: stats.pendingVerifications,
    },
    {
      icon: FileText,
      label: 'Moderate Reports',
      description: 'Kelola laporan',
      to: '/admin/reports',
      color: 'cyan',
    },
    {
      icon: Award,
      label: 'Verify Claims',
      description: 'Verifikasi klaim',
      to: '/admin/claims',
      color: 'violet',
    },
    {
      icon: Users,
      label: 'Manage Users',
      description: 'Kelola mahasiswa',
      to: '/admin/users',
      color: 'green',
    },
  ];

  const statCards = [
    {
      label: 'Pending KTM',
      value: stats.pendingVerifications,
      icon: UserCheck,
      color: 'blue',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers || '—',
      icon: Users,
      color: 'cyan',
    },
    {
      label: 'Total Reports',
      value: stats.totalReports || '—',
      icon: FileText,
      color: 'yellow',
    },
    {
      label: 'Pending Claims',
      value: stats.pendingClaims || '—',
      icon: Award,
      color: 'green',
    },
  ];

  return (
    <div className="dashboard-page">
      <AmbientBackground />
      <Navbar />

      <div className="dashboard-container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="dashboard-title">
              <Shield size={40} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '12px' }} />
              Admin Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Kelola sistem CaBang Perpustakaan UNDIP
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`stat-card stat-${stat.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="stat-icon-wrapper">
                <stat.icon className="stat-icon" size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {isLoading ? '—' : stat.value}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="section-title">Admin Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link to={action.to} className={`action-card action-${action.color}`}>
                  <div className="action-icon">
                    <action.icon size={28} />
                  </div>
                  <div className="action-content">
                    <h3 className="action-label">
                      {action.label}
                      {action.count > 0 && (
                        <span className="action-badge">{action.count}</span>
                      )}
                    </h3>
                    <p className="action-description">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Info */}
        <motion.div
          className="section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="section-title">System Information</h2>
          <div className="info-card">
            <div className="info-item">
              <TrendingUp size={20} className="info-icon" />
              <div className="info-content">
                <div className="info-label">Logged in as</div>
                <div className="info-value">{user?.name} (Admin)</div>
              </div>
            </div>
            <div className="info-item">
              <TrendingUp size={20} className="info-icon" />
              <div className="info-content">
                <div className="info-label">Email</div>
                <div className="info-value">{user?.email}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
