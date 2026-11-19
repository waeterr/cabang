import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import './AppLayout.css';

const navigation = [
  { to: '/dashboard', label: 'Beranda', icon: '⌂' },
  { to: '/reports', label: 'Cari barang', icon: '⌕' },
  { to: '/reports/new', label: 'Buat laporan', icon: '+' },
  { to: '/my-reports', label: 'Laporan saya', icon: '▤' },
  { to: '/my-claims', label: 'Klaim saya', icon: '✓' },
  { to: '/profile', label: 'Profil', icon: '◉' },
];

const AppLayout = ({ children, title, description, action }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Local logout must still work if token is invalid or server is unavailable.
    } finally {
      clearAuth();
      toast.success('Anda sudah keluar.');
      navigate('/login');
    }
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Navigasi utama">
        <Link className="app-wordmark" to="/dashboard">
          <span aria-hidden="true">▥</span>
          <span>CaBang</span>
        </Link>
        <p className="app-context">Perpustakaan UNDIP</p>

        <nav className="app-nav">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}
              key={item.to}
              to={item.to}
            >
              <span aria-hidden="true" className="app-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-account">
          <div className="app-avatar" aria-hidden="true">{user?.name?.charAt(0).toUpperCase() ?? '?'}</div>
          <div className="app-account-copy">
            <strong>{user?.name ?? 'Mahasiswa UNDIP'}</strong>
            <span className="mono">{user?.nim ?? '—'}</span>
          </div>
          <button aria-label="Keluar" className="app-logout" onClick={handleLogout} title="Keluar" type="button">↗</button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div>
            <p className="app-eyebrow">CaBang / Perpustakaan UNDIP</p>
            <h1>{title}</h1>
            {description && <p className="app-description">{description}</p>}
          </div>
          {action && <div className="app-header-action">{action}</div>}
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
