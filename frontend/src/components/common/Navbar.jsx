import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../../api/auth';
import { getUnreadCount } from '../../api/inbox';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Silent fail
    } finally {
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return undefined;
    }

    const loadUnreadCount = () => {
      getUnreadCount()
        .then((data) => setUnreadCount(data.unread_count || 0))
        .catch(() => {});
    };

    loadUnreadCount();
    const interval = window.setInterval(loadUnreadCount, 30000);

    return () => window.clearInterval(interval);
  }, [isAuthenticated]);

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/items/lost', label: 'Lost' },
    { path: '/items/found', label: 'Found' },
  ];

  const isAdmin = user?.role === 'admin';

  const reportAction = isAdmin
    ? { to: '/admin/reports/found/create', label: 'Tambah Barang Ditemukan' }
    : { to: '/reports/create', label: 'Laporkan Barang Hilang' };

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ x: '-50%', y: -100, opacity: 0 }}
        animate={{ x: '-50%', y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <motion.span
              className="brand-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CaBang
            </motion.span>
            <span className="brand-subtitle">Perpustakaan UNDIP</span>
          </Link>

          <div className="navbar-links desktop-only">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    className="nav-link-indicator"
                    layoutId="navIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <button
              aria-label={theme === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
              className="nav-theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
              type="button"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="nav-cta">
                  <span>Dashboard</span>
                </Link>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/reports/create'}
                  className="nav-action-link"
                  title={reportAction.label}
                >
                  {isAdmin ? 'Tambah Ditemukan' : 'Lapor Hilang'}
                </Link>
                <Link className="nav-inbox" title="Inbox" to="/inbox">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="nav-inbox-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </Link>
                <button onClick={handleLogout} className="nav-logout" title="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-action-link">
                  Masuk
                </Link>
                <Link to="/register" className="nav-cta">
                  Daftar
                </Link>
              </>
            )}

            <button
              className="mobile-menu-button mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-menu-content">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-menu-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <button className="mobile-menu-link" onClick={toggleTheme} type="button">
                {theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={isAdmin ? '/admin/reports/found/create' : '/reports/create'}
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {reportAction.label}
                  </Link>
                  <Link
                    to="/inbox"
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inbox{unreadCount > 0 ? ` (${unreadCount})` : ''}
                  </Link>
                  <Link
                    to="/history"
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Riwayat
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-menu-link"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
