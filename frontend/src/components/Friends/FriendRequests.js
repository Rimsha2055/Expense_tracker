import React, { useState, useEffect } from 'react';
import { friendService } from '../../services/friends';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await friendService.getFriendRequests();
      if (response.success) {
        setRequests(response.data);
      }
    } catch (error) {
      toast.error('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResponse = async (requestId, status) => {
    try {
      const response = await friendService.respondToFriendRequest(requestId, status);
      if (response.success) {
        toast.success(status === 'accepted' ? 'Friend request accepted!' : 'Friend request rejected');
        fetchRequests();
      }
    } catch (error) {
      toast.error('Failed to process request');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#333',
          margin: '0 0 10px 0'
        }}>
          Friend Requests
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Manage incoming friend requests
        </p>
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '60px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '20px',
            border: '2px dashed #ddd'
          }}
        >
          <div style={{
            fontSize: '60px',
            marginBottom: '20px',
            opacity: 0.3
          }}>
            📨
          </div>
          <h3 style={{
            fontSize: '24px',
            color: '#666',
            marginBottom: '10px'
          }}>
            No pending requests
          </h3>
          <p style={{ color: '#999' }}>
            You don't have any pending friend requests
          </p>
        </motion.div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '20px'
                }}>
                  {request.requester?.username?.charAt(0).toUpperCase()}
                </div>
                
                <div>
                  <h4 style={{
                    margin: '0 0 5px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    {request.requester?.username}
                  </h4>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {request.requester?.email}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <span>⏳</span>
                    Pending
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResponse(request.id, 'accepted')}
                  style={{
                    padding: '12px 30px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span>✓</span>
                  Accept
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResponse(request.id, 'rejected')}
                  style={{
                    padding: '12px 30px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  <span>✕</span>
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FriendRequests;