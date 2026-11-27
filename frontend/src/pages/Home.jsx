import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Plus, TrendingUp, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getPublicStats, getReports } from '../api/reports';
import { getStorageUrl, handleApiError, getRelativeTime } from '../utils/helpers';
import Navbar from '../components/common/Navbar';
import AmbientBackground from '../components/common/AmbientBackground';
import useAuthStore from '../store/authStore';
import gedungImage from '../assets/gedung.jpg';
import gedungInteriorImage from '../assets/geddung2.jpg';
import './Home.css';

const Home = () => {
  const [statsData, setStatsData] = useState({ found: 0, active: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [gedungImage, gedungInteriorImage];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [foundData, lostData, stats] = await Promise.all([
          getReports({ type: 'found', per_page: 3 }),
          getReports({ type: 'lost', per_page: 3 }),
          getPublicStats(),
        ]);

        const latestItems = [...(foundData.data || []), ...(lostData.data || [])]
          .sort((first, second) => new Date(second.created_at) - new Date(first.created_at))
          .slice(0, 3);

        setRecentItems(latestItems);
        setStatsData({
          found: stats.reports?.found_items || 0,
          active: (stats.reports?.pending || 0) + (stats.reports?.approved || 0),
        });
      } catch (error) {
        toast.error(handleApiError(error));
      }
    };

    fetchHomeData();
  }, []);

  const stats = [
    { label: 'Barang Ditemukan', value: statsData.found, icon: Package },
    { label: 'Laporan Aktif', value: statsData.active, icon: TrendingUp },
  ];

  return (
    <div className="home-page">
      <AmbientBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slideshow" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <div
              key={slide}
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="hero-slide-overlay" />
        </div>

        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Kehilangan sesuatu?
              <br />
              <span className="text-gradient">Mari kita temukan.</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Platform cari barang hilang Perpustakaan UNDIP.
              <br />
              Laporkan barang hilang atau bantu temukan pemiliknya.
            </motion.p>

            <motion.div
              className="hero-search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Cari barang hilang..."
                  className="search-input"
                />
                <button className="search-button">Cari</button>
              </div>
            </motion.div>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/items/lost" className="hero-btn hero-btn-secondary">
                <Search size={18} />
                Lihat Barang
              </Link>
              <Link
                to={isAdmin ? '/admin/reports/found/create' : '/reports/create'}
                className="hero-btn hero-btn-primary"
              >
                <Plus size={18} />
                {isAdmin ? 'Tambah Barang Temuan' : 'Laporkan Barang'}
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <stat.icon className="stat-icon" size={20} />
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="recent-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Aktivitas Terbaru</h2>
            <p className="section-description">
              Laporan barang hilang dan temuan terbaru dari komunitas
            </p>
          </motion.div>

          <div className="items-grid">
            {recentItems.length === 0 ? (
              <p className="empty-recent">Belum ada laporan terbaru.</p>
            ) : (
              recentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="item-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div className="item-image-wrapper">
                    {item.photo_path ? (
                      <img src={getStorageUrl(item.photo_path)} alt={item.item_name} className="item-image" />
                    ) : (
                      <div className="item-placeholder"><Package size={48} /></div>
                    )}
                    <div className={`item-badge ${item.type}`}>
                      {item.type === 'lost' ? 'Hilang' : 'Temuan'}
                    </div>
                  </div>
                  <div className="item-content">
                    <h3 className="item-name">{item.item_name}</h3>
                    <div className="item-meta">
                      <span className="item-category">{item.category}</span>
                      <span className="item-separator">•</span>
                      <span className="item-location">{item.location}</span>
                    </div>
                    <div className="item-date">{getRelativeTime(item.created_at)}</div>
                  </div>
                  <Link to={`/items/${item.id}`} className="item-link">
                    Lihat Detail
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            className="section-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/items/lost" className="cta-button">
              Lihat Semua Barang
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Cara Kerja</h2>
            <p className="section-description">
              Langkah mudah untuk melaporkan atau menemukan barang Anda
            </p>
          </motion.div>

          <div className="steps-grid">
            {[
              {
                step: '01',
                title: 'Laporkan',
                description: 'Kehilangan sesuatu? Buat laporan dengan detail barang dan lokasi.',
              },
              {
                step: '02',
                title: 'Cari',
                description: 'Menemukan sesuatu? Lihat daftar barang hilang untuk membantu mengembalikannya.',
              },
              {
                step: '03',
                title: 'Terhubung',
                description: 'Cocok! Koordinasikan dengan pemilik untuk pengembalian yang aman.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                className="step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="step-number">{step.step}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">CaBang</div>
              <p className="footer-tagline">
                CaBang - Sistem Barang Hilang &amp; Temuan
                <br />
                Perpustakaan UNDIP
              </p>
            </div>
            <div className="footer-links">
              <Link to="/" className="footer-link">Beranda</Link>
              <Link to="/items/lost" className="footer-link">Barang Hilang</Link>
              <Link to="/items/found" className="footer-link">Barang Temuan</Link>
              <Link to="/login" className="footer-link">Masuk</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CaBang. Perpustakaan UNDIP. Hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
