import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiAlertCircle
} from 'react-icons/fi';
import { checkBackendConnection } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const [backendStatus, setBackendStatus] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      // If user arrived via invite token, try to accept it now
      if (inviteToken) {
        try {
          const { friendService } = await import('../../services/friends');
          const res = await friendService.acceptInvite(inviteToken);
          if (res.success) {
            toast.success(res.message || 'Invite accepted — you are now friends');
            navigate('/friends');
          } else if (res.data && res.data.token) {
            // Strange: still requires registration
            navigate('/');
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error('Accept invite after register failed', err);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const ok = await checkBackendConnection();
      setBackendStatus(ok);
    })();
  }, []);

  const isTablet = windowWidth <= 900;
  const isMobile = windowWidth <= 480;

  // Center everything for all screen sizes
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '16px' : '24px',
    position: 'relative',
    zIndex: 10,
    fontFamily: '"Poppins", "Inter", sans-serif'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: isMobile ? '100%' : isTablet ? '450px' : '520px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: isMobile ? '28px 20px' : '40px 32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  };

  // Blue-slate gradient background
  const backgroundStyle = {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    zIndex: 0,
    overflow: 'hidden'
  };

  const gradientOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), ' +
                'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
    zIndex: 1
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px 14px 48px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    transition: 'all 0.3s ease'
  };

  const inputFocusStyle = {
    borderColor: '#60a5fa',
    background: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.2)',
    outline: 'none'
  };

  useEffect(() => {
    // Ensure body doesn't have hidden overflow on mobile
    if (isMobile) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile]);

  return (
    <>
      {/* Blue-slate gradient background */}
      <div style={backgroundStyle}>
        <div style={gradientOverlayStyle} />
        {/* Optional animated particles or dots */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />
      </div>

      {/* Centered Container */}
      <div style={containerStyle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <div style={cardStyle}>
            {/* Backend Warning */}
            {backendStatus === false && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <FiAlertCircle size={18} />
                <div>
                  <strong>Backend Offline</strong> → 
                  <code style={{ 
                    background: 'rgba(0, 0, 0, 0.3)', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    marginLeft: '8px',
                    fontSize: '13px'
                  }}>
                    npm start
                  </code>
                </div>
              </motion.div>
            )}

            {/* Logo + Title - Centered */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{
                  width: '72px',
                  height: '72px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 ',
                  borderRadius: '20px',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px linear-gradient(135deg, #3b82f6 0%, #1d4ed8 '
                }}
              >
                <FiUserPlus size={32} color="white" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: isMobile ? '28px' : '32px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  background: 'linear-gradient(to right, #e0f2fe, #dbeafe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Create Account
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ 
                  fontSize: '14px', 
                  opacity: 0.8,
                  color: '#cbd5e1'
                }}
              >
                Join us and start tracking expenses
              </motion.p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#e2e8f0'
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    fontSize: '16px', 
                    opacity: 0.7,
                    color: '#94a3b8'
                  }}>
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="johndoe"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#e2e8f0'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    fontSize: '16px', 
                    opacity: 0.7,
                    color: '#94a3b8'
                  }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#e2e8f0'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    fontSize: '16px', 
                    opacity: 0.7,
                    color: '#94a3b8'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#e2e8f0'
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    fontSize: '16px', 
                    opacity: 0.7,
                    color: '#94a3b8'
                  }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Create Account Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 ',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px linear-gradient(135deg, #3b82f6 0%, #1d4ed8 ',
                  opacity: loading ? 0.8 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FiUserPlus size={19} />
                    Create Account
                  </>
                )}
              </motion.button>
            </form>

            {/* Already have an account? Sign In */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <p style={{
                fontSize: '15px',
                color: '#cbd5e1',
                opacity: 0.9,
                margin: '0'
              }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#60a5fa',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                     background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.WebkitTextFillColor = 'transparent';
                    e.target.style.background = 'linear-gradient(to right, #93c5fd, #60a5fa)';
                    e.target.style.WebkitBackgroundClip = 'text';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.WebkitTextFillColor = 'transparent';
                    e.target.style.background = 'linear-gradient(to right, #60a5fa, #3b82f6)';
                    e.target.style.WebkitBackgroundClip = 'text';
                  }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
        
        input:focus {
          outline: none;
        }
        
        body {
          font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0f172a;
          color: white;
          overflow-x: hidden;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.8);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.9);
        }
      `}</style>
    </>
  );
};

export default Register;