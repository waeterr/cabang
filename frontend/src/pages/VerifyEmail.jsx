import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, MailWarning } from 'lucide-react';
import toast from 'react-hot-toast';
import { resendEmailVerification } from '../api/auth';
import useAuthStore from '../store/authStore';
import { handleApiError } from '../utils/helpers';
import AmbientBackground from '../components/common/AmbientBackground';
import Navbar from '../components/common/Navbar';
import './Inbox.css';

const VerifyEmail = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isSending, setIsSending] = useState(false);
  const isVerified = Boolean(user?.email_verified_at);

  useEffect(() => {
    if (window.location.search.includes('verified=1')) {
      toast.success('Email berhasil diverifikasi');
    }
  }, []);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendEmailVerification();
      toast.success('Tautan verifikasi dikirim. Periksa email Anda.');
      if (user) {
        setUser({ ...user });
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="inbox-page">
      <AmbientBackground />
      <Navbar />
      <main className="inbox-container">
        <section className="inbox-empty">
          {isVerified ? <MailCheck size={54} /> : <MailWarning size={54} />}
          <h2>{isVerified ? 'Email sudah terverifikasi' : 'Verifikasi email Anda'}</h2>
          <p>
            {isVerified
              ? 'Akun email Anda sudah terverifikasi. Lanjutkan dengan verifikasi KTM.'
              : `Kami mengirim tautan verifikasi ke ${user?.email || 'email Anda'}. Cek inbox dan klik tautannya.`}
          </p>
          <div className="verify-actions">
            {!isVerified && (
              <button className="inbox-read-all" disabled={isSending} onClick={handleResend} type="button">
                {isSending ? 'Mengirim...' : 'Kirim ulang tautan'}
              </button>
            )}
            <Link className="inbox-read-all" to="/dashboard">Ke Dashboard</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VerifyEmail;
