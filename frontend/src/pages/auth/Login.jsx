import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import { handleApiError } from '../../utils/helpers';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.email) {
      nextErrors.email = 'Email wajib diisi.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = 'Format email tidak valid.';
    }

    if (!formData.password) {
      nextErrors.password = 'Password wajib diisi.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(formData);
      setAuth(response.user, response.token);
      toast.success('Login berhasil.');
      navigate(response.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      setErrors(error.response?.data?.errors ?? {});
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <Link className="auth-brand" to="/">CaBang</Link>
        <h1 id="login-title">Masuk</h1>
        <p className="auth-description">Cari Barang Hilang Universitas Diponegoro</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">
            Email
            <input
              autoComplete="email"
              disabled={isLoading}
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="nama@students.undip.ac.id"
              type="email"
              value={formData.email}
            />
            {errors.email && <span className="field-error">{errors.email[0] ?? errors.email}</span>}
          </label>

          <label htmlFor="password">
            Password
            <input
              autoComplete="current-password"
              disabled={isLoading}
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Masukkan password"
              type="password"
              value={formData.password}
            />
            {errors.password && <span className="field-error">{errors.password[0] ?? errors.password}</span>}
          </label>

          <button disabled={isLoading} type="submit">
            {isLoading ? 'Memproses…' : 'Masuk'}
          </button>
        </form>

        <p className="auth-footer">Belum punya akun? <Link to="/register">Daftar sekarang</Link></p>
        <Link className="back-link" to="/">← Kembali ke beranda</Link>
      </section>
    </main>
  );
};

export default Login;
