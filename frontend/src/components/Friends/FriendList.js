import React, { useState, useEffect } from 'react';
import { friendService } from '../../services/friends';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiUsers, FiCheckCircle, FiDollarSign, FiTrash2 } from 'react-icons/fi';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await friendService.getFriends();
      if (response.success) {
        setFriends(response.data);
      }
    } catch (error) {
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for updates from AddFriend (optimistic adds)
  useEffect(() => {
    const handler = () => fetchFriends();
    window.addEventListener('friends-updated', handler);
    return () => window.removeEventListener('friends-updated', handler);
  }, []);

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        const response = await friendService.removeFriend(friendId);
        if (response.success) {
          toast.success('Friend removed successfully');
          fetchFriends();
        }
      } catch (error) {
        toast.error('Failed to remove friend');
      }
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.receiver?.username?.toLowerCase().includes(search.toLowerCase()) ||
    friend.receiver?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            Friends
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            Connect with friends to share expenses
          </p>
        </div>
        
        <div style={{ position: 'relative', width: isMobile ? '100%' : '300px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friends..."
            style={{
              width: '100%',
              padding: '14px 20px 14px 50px',
              background: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '15px',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: '#9ca3af'
          }}>
            <FiSearch />
          </div>
        </div>
      </div>

      {/* Friend List */}
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
      ) : filteredFriends.length === 0 ? (
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
            <FiUsers />
          </div>
          <h3 style={{
            fontSize: '24px',
            color: '#666',
            marginBottom: '10px'
          }}>
            {search ? 'No friends found' : 'No friends yet'}
          </h3>
          <p style={{ color: '#999' }}>
            {search ? 'Try a different search' : 'Add friends to start sharing expenses'}
          </p>
        </motion.div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          {filteredFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s',
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}>
                  {friend.receiver?.username?.charAt(0).toUpperCase()}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 5px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    {friend.receiver?.username}
                  </h4>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {friend.receiver?.email}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <FiCheckCircle />
                    Connected
                  </div>
                </div>
              </div>

              
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRemoveFriend(friend.receiver.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '10px',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                  <span><FiTrash2 /></span>
                  Remove
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

export default FriendList;