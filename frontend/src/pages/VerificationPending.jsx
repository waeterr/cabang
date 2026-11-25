import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import useAuthStore from '../store/authStore';

const VerificationPending = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    getCurrentUser()
      .then(({ user }) => {
        setUser(user);
        if (user.is_verified && user.verification_status === 'approved') {
          navigate('/dashboard', { replace: true });
        }
      })
      .catch(() => {
        clearAuth();
        navigate('/login', { replace: true });
      });
  }, [clearAuth, navigate, setUser]);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Menunggu Verifikasi</h1>
      <p>Akun Anda sedang dalam proses verifikasi oleh admin.</p>
      <p>Silakan tunggu hingga KTM Anda diverifikasi untuk mengakses fitur lengkap.</p>
    </main>
  );
};

export default VerificationPending;
