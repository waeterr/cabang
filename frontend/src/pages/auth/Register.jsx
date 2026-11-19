import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import { handleApiError } from '../../utils/helpers';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    email: '',
    password: '',
    password_confirmation: '',
    ktm: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [ktmPreview, setKtmPreview] = useState(null);

  const handleChange = ({ target: { name, value, files } }) => {
    if (name === 'ktm' && files?.[0]) {
      const file = files[0];
      
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, ktm: 'Format file harus JPG, PNG, atau PDF' }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, ktm: 'Ukuran file maksimal 2MB' }));
        return;
      }
      
      setFormData((prev) => ({ ...prev, ktm: file }));
      
      // Preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setKtmPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setKtmPreview('pdf');
      }
      
      setErrors((prev) => ({ ...prev, ktm: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name) {
      nextErrors.name = 'Nama lengkap wajib diisi.';
    }

    if (!formData.nim) {
      nextErrors.nim = 'NIM wajib diisi.';
    } else if (!/^\d{14}$/.test(formData.nim)) {
      nextErrors.nim = 'NIM harus 14 digit angka.';
    }

    if (!formData.email) {
      nextErrors.email = 'Email wajib diisi.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = 'Format email tidak valid.';
    }

    if (!formData.password) {
      nextErrors.password = 'Password wajib diisi.';
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password minimal 8 karakter.';
    }

    if (!formData.password_confirmation) {
      nextErrors.password_confirmation = 'Konfirmasi password wajib diisi.';
    } else if (formData.password !== formData.password_confirmation) {
      nextErrors.password_confirmation = 'Password tidak sama.';
    }

    if (!formData.ktm) {
      nextErrors.ktm = 'File KTM wajib diunggah.';
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
      const data = new FormData();
      data.append('name', formData.name);
      data.append('nim', formData.nim);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('password_confirmation', formData.password_confirmation);
      data.append('ktm', formData.ktm);

      await register(data);
      
      toast.success('Registrasi berhasil! Menunggu verifikasi admin.');
      
      // For now, don't auto-login since account needs verification
      // Just redirect to login
      navigate('/login');
    } catch (error) {
      setErrors(error.response?.data?.errors ?? {});
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <Link className="auth-brand" to="/">CaBang</Link>
        <h1 id="register-title">Daftar Akun</h1>
        <p className="auth-description">
          Buat akun untuk mulai melaporkan dan mencari barang di Perpustakaan UNDIP
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">
            Nama Lengkap
            <input
              autoComplete="name"
              disabled={isLoading}
              id="name"
              name="name"
              onChange={handleChange}
              placeholder="Nama sesuai KTM"
              type="text"
              value={formData.name}
            />
            {errors.name && <span className="field-error">{errors.name[0] ?? errors.name}</span>}
          </label>

          <label htmlFor="nim">
            NIM
            <input
              autoComplete="off"
              disabled={isLoading}
              id="nim"
              name="nim"
              onChange={handleChange}
              placeholder="14 digit NIM UNDIP"
              type="text"
              value={formData.nim}
              className="mono"
            />
            {errors.nim && <span className="field-error">{errors.nim[0] ?? errors.nim}</span>}
          </label>

          <label htmlFor="email">
            Email Mahasiswa
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
              autoComplete="new-password"
              disabled={isLoading}
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Minimal 8 karakter"
              type="password"
              value={formData.password}
            />
            {errors.password && <span className="field-error">{errors.password[0] ?? errors.password}</span>}
          </label>

          <label htmlFor="password_confirmation">
            Konfirmasi Password
            <input
              autoComplete="new-password"
              disabled={isLoading}
              id="password_confirmation"
              name="password_confirmation"
              onChange={handleChange}
              placeholder="Ketik ulang password"
              type="password"
              value={formData.password_confirmation}
            />
            {errors.password_confirmation && (
              <span className="field-error">{errors.password_confirmation[0] ?? errors.password_confirmation}</span>
            )}
          </label>

          <label htmlFor="ktm" className="file-upload-label">
            Kartu Tanda Mahasiswa (KTM)
            <input
              accept=".jpg,.jpeg,.png,.pdf"
              disabled={isLoading}
              id="ktm"
              name="ktm"
              onChange={handleChange}
              type="file"
            />
            <span className="file-help">JPG, PNG, atau PDF. Maksimal 2MB</span>
            {errors.ktm && <span className="field-error">{errors.ktm[0] ?? errors.ktm}</span>}
          </label>

          {ktmPreview && (
            <div className="ktm-preview">
              {ktmPreview === 'pdf' ? (
                <div className="pdf-placeholder">
                  <span className="pdf-icon">📄</span>
                  <span className="pdf-name">{formData.ktm?.name}</span>
                </div>
              ) : (
                <img src={ktmPreview} alt="Preview KTM" />
              )}
            </div>
          )}

          <button disabled={isLoading} type="submit">
            {isLoading ? 'Memproses…' : 'Daftar'}
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
        <Link className="back-link" to="/">← Kembali ke beranda</Link>
      </section>
    </main>
  );
};

export default Register;
