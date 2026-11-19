import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import AmbientBackground from '../../components/common/AmbientBackground';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, token } = await login(formData);

      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.is_verified && user.verification_status === 'approved') {
        navigate('/dashboard');
      } else {
        navigate('/verification-pending');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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
          className="auth-card"
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
              <LogIn size={32} />
            </motion.div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue to CaBang</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="Enter your password"
                  className="form-input"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one
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
            Lost & Found
            <br />
            <span className="text-gradient">Made Simple</span>
          </h2>
          <p className="info-description">
            CaBang membantu Anda menemukan kembali barang hilang dengan cepat dan mudah.
            Bergabunglah dengan komunitas UNDIP untuk kampus yang lebih baik.
          </p>
          <div className="info-features">
            <div className="info-feature">
              <div className="feature-dot" />
              <span>Quick item reporting</span>
            </div>
            <div className="info-feature">
              <div className="feature-dot" />
              <span>Real-time notifications</span>
            </div>
            <div className="info-feature">
              <div className="feature-dot" />
              <span>Secure verification</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
