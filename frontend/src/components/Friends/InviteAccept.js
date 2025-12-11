import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { friendService } from '../../services/friends';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi';

export default function InviteAccept() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing invite...');

  useEffect(() => {
    (async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid invite link');
        setLoading(false);
        return;
      }

      try {
        const res = await friendService.acceptInvite(token);
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'You are now friends!');
          setTimeout(() => navigate('/friends'), 3000);
        } else if (res.data && res.data.token) {
          // user not registered yet
          setStatus('signup');
          setMessage('Please sign up to complete the friendship');
          setTimeout(() => navigate(`/register?invite=${res.data.token}`), 2000);
        } else {
          setStatus('error');
          setMessage(res.message || 'Unable to accept invite');
        }
      } catch (err) {
        console.error('Accept invite error:', err);
        setStatus('error');
        setMessage('Failed to accept invite');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: '#fff',
          borderRadius: '25px',
          padding: '50px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <h2 style={{ color: '#333', marginTop: '20px' }}>Processing your invite...</h2>
          </>
        ) : status === 'success' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ fontSize: '60px', marginBottom: '20px' }}
            >
              <FiCheckCircle style={{ color: '#10b981', fontSize: '60px' }} />
            </motion.div>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Success!</h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
              {message}
            </p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              Redirecting to your friends list...
            </p>
          </>
        ) : status === 'signup' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ fontSize: '60px', marginBottom: '20px' }}
            >
              <FiUser style={{ color: '#667eea', fontSize: '60px' }} />
            </motion.div>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Sign Up Required</h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
              {message}
            </p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              Redirecting to sign up...
            </p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ fontSize: '60px', marginBottom: '20px' }}
            >
              <FiXCircle style={{ color: '#ef4444', fontSize: '60px' }} />
            </motion.div>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Error</h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
              {message}
            </p>
            <motion.button
              onClick={() => navigate('/friends')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 30px',
                background: '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              Go to Friends
            </motion.button>
          </>
        )}
      </motion.div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
