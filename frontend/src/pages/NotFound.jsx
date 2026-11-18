import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Halaman tidak ditemukan.</p>
      <Link to="/">Kembali ke beranda</Link>
    </main>
  );
};

export default NotFound;
