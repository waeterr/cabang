import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import './Home.css';

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Hero entrance animation
    if (heroRef.current) {
      heroRef.current.setAttribute('data-enter', 'true');
    }
  }, []);

  return (
    <div className="home">
      <header className="home-header">
        <div className="header-wrap">
          <div className="home-brand">
            <span className="brand-mark">📚</span>
            CaBang
          </div>
          <nav className="home-nav">
            <Link to="/login" className="nav-link">Masuk</Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="hero" ref={heroRef}>
          <div className="hero-content">
            <div className="hero-pill">Perpustakaan UNDIP</div>
            <h1 className="hero-title">
              Temukan Barang<br />
              Hilang di Perpus
            </h1>
            <p className="hero-lead">
              Platform resmi untuk melaporkan dan mencari barang hilang di Perpustakaan Universitas Diponegoro. Aman, cepat, terverifikasi.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Daftar Sekarang
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Masuk
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="app-frame">
              <div className="frame-header">
                <div className="frame-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="frame-title mono">cabang.undip.ac.id</div>
              </div>
              <div className="frame-content">
                <div className="mock-card">
                  <div className="mock-badge">Barang Ditemukan</div>
                  <div className="mock-title">Dompet Coklat</div>
                  <div className="mock-meta">
                    <span className="mono">📍 Ruang Baca Lt. 3</span>
                    <span className="mono">⏱️ 2 jam lalu</span>
                  </div>
                  <div className="mock-action">Ajukan Klaim →</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-wrap">
            <h2 className="section-title">Sistem yang Terpercaya</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <span className="icon-mark">✓</span>
                </div>
                <h3 className="feature-title">Verifikasi KTM</h3>
                <p className="feature-text">
                  Setiap pengguna diverifikasi dengan KTM untuk memastikan keamanan dan kepercayaan komunitas perpustakaan.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <span className="icon-mark">🔍</span>
                </div>
                <h3 className="feature-title">Pencarian Cepat</h3>
                <p className="feature-text">
                  Filter berdasarkan lokasi ruang baca, kategori barang, dan waktu untuk menemukan barang dengan mudah.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <span className="icon-mark">👥</span>
                </div>
                <h3 className="feature-title">Moderasi Admin</h3>
                <p className="feature-text">
                  Setiap laporan dan klaim diverifikasi oleh admin perpustakaan untuk mencegah penyalahgunaan.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-wrap">
            <div className="cta-content">
              <h2 className="cta-title">Mulai Gunakan CaBang</h2>
              <p className="cta-text">
                Bergabung dengan ratusan mahasiswa UNDIP yang sudah menggunakan CaBang untuk menemukan barang hilang di perpustakaan.
              </p>
              <Link to="/register" className="btn btn-primary btn-large">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-wrap">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo">
                <span className="brand-mark">📚</span>
                <span className="brand-name">CaBang</span>
              </div>
              <p className="footer-tagline">
                Platform barang hilang<br />Perpustakaan UNDIP
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4 className="footer-heading">Platform</h4>
                <ul className="footer-list">
                  <li><Link to="/login">Masuk</Link></li>
                  <li><Link to="/register">Daftar</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4 className="footer-heading">Kontak</h4>
                <address className="footer-address">
                  Perpustakaan Pusat UNDIP<br />
                  Jl. Prof. Sudarto, Tembalang<br />
                  Semarang, Jawa Tengah
                </address>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 CaBang — Perpustakaan Universitas Diponegoro</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
