import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <h1>CaBang</h1>
      <p>Cari Barang Hilang Universitas Diponegoro</p>
      <Link to="/login">Masuk</Link>
      {' | '}
      <Link to="/register">Daftar</Link>
    </main>
  );
};

export default Home;
