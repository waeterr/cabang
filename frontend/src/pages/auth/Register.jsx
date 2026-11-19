import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, CreditCard, Upload, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { register } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import AmbientBackground from '../../components/common/AmbientBackground';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    email: '',
    password: '',
    password_confirmation: '',
    ktm: null,
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      setFormData({
        ...formData,
        ktm: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.ktm) {
      toast.error('Please upload your KTM');
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('nim', formData.nim);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('password_confirmation', formData.password_confirmation);
    data.append('ktm', formData.ktm);

    try {
      const { user, token } = await register(data);

      setAuth(user, token);
      toast.success('Registration successful! Please wait for verification.');
      navigate('/verification-pending');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AmbientBackground />

      <Link to="/" className="auth-back-link">
        <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
        <span>Back to Home</span>
      </Link>

      <div className="auth-container">
        <motion.div
          className="auth-card register-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <motion.div
              className="auth-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            >
              <UserPlus size={32} />
            </motion.div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Bergabung dengan komunitas CaBang</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="form-input"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nim" className="form-label">
                NIM
              </label>
              <div className="input-wrapper">
                <CreditCard className="input-icon" size={18} />
                <input
                  type="text"
                  id="nim"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="24060122140001"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@students.undip.ac.id"
                  className="form-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="form-input"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="form-input"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ktm" className="form-label">
                Upload KTM
              </label>
              <div className="upload-wrapper">
                <input
                  type="file"
                  id="ktm"
                  name="ktm"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="upload-input"
                  required
                />
                <label htmlFor="ktm" className="upload-label">
                  {preview ? (
                    <img src={preview} alt="KTM Preview" className="upload-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={24} />
                      <span>Click to upload KTM</span>
                      <span className="upload-hint">PNG, JPG up to 2MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="auth-info"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="info-title">
            Bergabung dengan
            <br />
            <span className="text-gradient">CaBang</span>
          </h2>
          <p className="info-description">
            Buat akun Anda dan mulai bantu komunitas UNDIP
            menemukan kembali barang hilang mereka.
          </p>
          <div className="info-features">
            <div className="info-feature">
              <div className="feature-dot" />
              <span>Quick registration</span>
            </div>
            <div className="info-feature">
              <div className="feature-dot" />
              <span>Secure KTM verification</span>
            </div>
            <div className="info-feature">
              <div className="feature-dot" />
              <span>Community support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
