import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Package, FileText, Award, TrendingUp, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { getMyReports } from '../../api/reports';
import { getMyClaims } from '../../api/claims';
import Navbar from '../../components/common/Navbar';
import AmbientBackground from '../../components/common/AmbientBackground';
import './Dashboard.css';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    myReports: 0,
    myClaims: 0,
    pendingReports: 0,
    resolvedReports: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, claimsRes] = await Promise.all([
          getMyReports(),
          getMyClaims(),
        ]);

        const reports = reportsRes.data || [];
        const claims = claimsRes.data || [];

        setStats({
          myReports: reports.length,
          myClaims: claims.length,
          pendingReports: reports.filter((r) => r.status === 'pending').length,
          resolvedReports: reports.filter((r) => r.status === 'resolved').length,
        });

        setRecentReports(reports.slice(0, 3));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      icon: Plus,
      label: 'Report Lost Item',
      description: 'Laporkan barang hilang',
      to: '/reports/create',
      color: 'blue',
    },
    {
      icon: Search,
      label: 'Browse Items',
      description: 'Cari barang hilang',
      to: '/items/lost',
      color: 'cyan',
    },
    {
      icon: FileText,
      label: 'My Reports',
      description: 'Laporan saya',
      to: '/reports/my',
      color: 'violet',
    },
    {
      icon: Award,
      label: 'My Claims',
      description: 'Klaim saya',
      to: '/claims/my',
      color: 'green',
    },
  ];

  const statCards = [
    {
      label: 'Total Reports',
      value: stats.myReports,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Total Claims',
      value: stats.myClaims,
      icon: Award,
      color: 'cyan',
    },
    {
      label: 'Pending',
      value: stats.pendingReports,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Resolved',
      value: stats.resolvedReports,
      icon: TrendingUp,
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
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="dashboard-subtitle">
              Kelola laporan dan klaim barang hilang Anda
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
          <h2 className="section-title">Quick Actions</h2>
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
                    <h3 className="action-label">{action.label}</h3>
                    <p className="action-description">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          className="section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">Recent Reports</h2>
            <Link to="/reports/my" className="section-link">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="loading-state">Loading...</div>
          ) : recentReports.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <p className="empty-title">No reports yet</p>
              <p className="empty-description">
                Mulai laporkan barang hilang Anda
              </p>
              <Link to="/reports/create" className="empty-action">
                Create Report
              </Link>
            </div>
          ) : (
            <div className="reports-list">
              {recentReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  className="report-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="report-content">
                    <h3 className="report-name">{report.item_name}</h3>
                    <div className="report-meta">
                      <span className="report-location">
                        <MapPin size={14} />
                        {report.location}
                      </span>
                      <span className="report-separator">•</span>
                      <span className={`report-status status-${report.status}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <Link to={`/reports/${report.id}`} className="report-link">
                    View
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
