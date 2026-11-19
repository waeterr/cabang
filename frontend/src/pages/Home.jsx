import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Plus, TrendingUp, Clock, MapPin, Package } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import AmbientBackground from '../components/common/AmbientBackground';
import './Home.css';

const Home = () => {
  const stats = [
    { label: 'Items Found', value: '1,234', icon: Package },
    { label: 'Active Reports', value: '89', icon: TrendingUp },
    { label: 'Avg Response', value: '2.5h', icon: Clock },
    { label: 'Locations', value: '12', icon: MapPin },
  ];

  const recentItems = [
    {
      id: 1,
      name: 'Blue Backpack',
      category: 'Bag',
      location: 'Library Floor 3',
      date: '2 hours ago',
      status: 'lost',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    },
    {
      id: 2,
      name: 'Student ID Card',
      category: 'Document',
      location: 'Canteen Area',
      date: '5 hours ago',
      status: 'found',
      image: 'https://images.unsplash.com/photo-1589395937772-903d7f229537?w=400',
    },
    {
      id: 3,
      name: 'Black Umbrella',
      category: 'Accessory',
      location: 'Lecture Hall A',
      date: '1 day ago',
      status: 'lost',
      image: 'https://images.unsplash.com/photo-1525003544775-df3a54a6d8f5?w=400',
    },
  ];

  return (
    <div className="home-page">
      <AmbientBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
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
              Lost something?
              <br />
              <span className="text-gradient">Let's find it.</span>
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
                  placeholder="Search for lost items..."
                  className="search-input"
                />
                <button className="search-button">Search</button>
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
                Browse Items
              </Link>
              <Link to="/reports/create" className="hero-btn hero-btn-primary">
                <Plus size={18} />
                Report an Item
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
            <h2 className="section-title">Recent Activity</h2>
            <p className="section-description">
              Latest lost and found items reported by the community
            </p>
          </motion.div>

          <div className="items-grid">
            {recentItems.map((item, index) => (
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
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className={`item-badge ${item.status}`}>
                    {item.status === 'lost' ? 'Lost' : 'Found'}
                  </div>
                </div>
                <div className="item-content">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-separator">•</span>
                    <span className="item-location">{item.location}</span>
                  </div>
                  <div className="item-date">{item.date}</div>
                </div>
                <Link to={`/items/${item.id}`} className="item-link">
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="section-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/items/lost" className="cta-button">
              View All Items
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
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Simple steps to report or find your items
            </p>
          </motion.div>

          <div className="steps-grid">
            {[
              {
                step: '01',
                title: 'Report',
                description: 'Lost something? Create a report with item details and location.',
              },
              {
                step: '02',
                title: 'Browse',
                description: 'Found something? Search through reported items to help return it.',
              },
              {
                step: '03',
                title: 'Connect',
                description: 'Match found! Coordinate with the owner for safe return.',
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
                CaBang - Lost & Found System
                <br />
                Perpustakaan UNDIP
              </p>
            </div>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/items/lost" className="footer-link">Lost Items</Link>
              <Link to="/items/found" className="footer-link">Found Items</Link>
              <Link to="/login" className="footer-link">Login</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CaBang. Perpustakaan UNDIP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
