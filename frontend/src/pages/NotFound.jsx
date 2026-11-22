import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import AmbientBackground from '../components/common/AmbientBackground';
import './NotFound.css';

const NotFound = () => (
  <div className="not-found-page">
    <AmbientBackground />
    <Navbar />
    <main className="not-found-content">
      <div className="not-found-icon"><Compass size={44} /></div>
      <p className="not-found-code">404</p>
      <h1 className="not-found-title">Halaman tidak ditemukan</h1>
      <p className="not-found-text">
        Tautan yang Anda buka tidak tersedia atau sudah dipindahkan.
      </p>
      <div className="not-found-actions">
        <Link className="not-found-primary" to="/"><Home size={18} /> Beranda</Link>
        <Link className="not-found-secondary" to="/items/lost"><Search size={18} /> Cari barang hilang</Link>
      </div>
    </main>
  </div>
);

export default NotFound;
