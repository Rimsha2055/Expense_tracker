import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiUserPlus, 
  FiAlertCircle, FiDollarSign, FiServer
} from 'react-icons/fi';
import { checkBackendConnection } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    (async () => {
      const ok = await checkBackendConnection();
      setBackendStatus(ok);
    })();
  }, []);

  const isMobile = windowWidth < 640;
  const isSmallMobile = windowWidth < 480;

  const loginContainerStyle = {
    padding: isMobile ? '16px' : '20px',
  };

  const loginCardStyle = {
    borderRadius: isMobile ? '20px' : '24px',
    padding: isSmallMobile ? '24px 20px' : (isMobile ? '32px 24px' : '40px'),
  };

  const headingStyle = {
    fontSize: isSmallMobile ? '24px' : (isMobile ? '28px' : '32px'),
  };

  return (
    <>
      {/* Full-Screen Blue Gradient Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 100%)',
        zIndex: 0,
      }}>
        {/* Subtle geometric pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.08) 0px, transparent 50%),
            linear-gradient(135deg, transparent 60%, rgba(147, 197, 253, 0.05) 100%)
          `,
          opacity: 0.8
        }} />
      </div>

      {/* Main Layout – Centered Professional Container */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...loginContainerStyle,
        position: 'relative',
        zIndex: 10,
        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            width: '100%',
            maxWidth: '440px',
          }}
        >
          {/* Backend Status Indicator */}
          {backendStatus === false && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '28px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backdropFilter: 'blur(10px)',
                color: '#fecaca'
              }}
            >
              <FiServer size={20} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontWeight: 600 }}>Backend Disconnected</strong>
                <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
                  Run <code style={{ 
                    background: 'rgba(0, 0, 0, 0.3)', 
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}>npm run server</code> to start the backend
                </div>
              </div>
            </motion.div>
          )}

          {/* Login Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...loginCardStyle,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            color: '#f8fafc'
          }}>
            {/* Logo & Title Section */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                style={{
                  width: '72px',
                  height: '72px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '20px',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 30px rgba(59, 130, 246, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <FiDollarSign size={36} color="#ffffff" />
              </motion.div>
              
              <h1 style={{
                ...headingStyle,
                fontWeight: '800',
                margin: '0 0 8px',
                background: 'linear-gradient(to right, #ffffff, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                Welcome Back
              </h1>
              
              <p style={{
                fontSize: '15px',
                color: '#cbd5e1',
                opacity: 0.9,
                lineHeight: '1.5'
              }}>
                Sign in to manage your expenses and finances
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
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
                    left: '18px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px',
                    color: '#94a3b8'
                  }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                    style={{
                      width: '100%',
                      padding: '16px 20px 16px 52px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '14px',
                      color: '#f1f5f9',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
                      e.target.style.background = 'rgba(30, 41, 59, 0.9)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = 'rgba(30, 41, 59, 0.6)';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#e2e8f0'
                  }}>
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    style={{
                      color: '#60a5fa',
                      fontSize: '13px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
                    onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{
                    position: 'absolute',
                    left: '18px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px',
                    color: '#94a3b8'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '16px 52px 16px 52px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '14px',
                      color: '#f1f5f9',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
                      e.target.style.background = 'rgba(30, 41, 59, 0.9)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = 'rgba(30, 41, 59, 0.6)';
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '18px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#e2e8f0'}
                    onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <input
                  type="checkbox"
                  id="remember"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                />
                <label 
                  htmlFor="remember"
                  style={{
                    fontSize: '14px',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.02 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '17px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                  opacity: loading ? 0.8 : 1,
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%'
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLogIn size={20} />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '28px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#94a3b8',
                marginBottom: '16px'
              }}>
                Don't have an account?
              </p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '14px 32px',
                    background: 'transparent',
                    border: '1.5px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '12px',
                    color: '#60a5fa',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                  }}
                >
                  <FiUserPlus size={18} />
                  Create Account
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body, #root {
          height: 100%;
          overflow: auto;
        }
        
        input::placeholder {
          color: rgba(148, 163, 184, 0.7);
        }
        
        input:focus {
          outline: none;
        }
      `}</style>
    </>
  );
};

export default Login;