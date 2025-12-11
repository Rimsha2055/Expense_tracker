import React, { useState, useEffect } from 'react';
import { groupService } from '../../services/groups';
import { friendService } from '../../services/friends';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GroupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberIds: []
  });
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchFriends();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await friendService.getFriends();
      if (response.success) {
        setFriends(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch friends');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMember = (friendId) => {
    setFormData(prev => {
      const memberIds = prev.memberIds.includes(friendId)
        ? prev.memberIds.filter(id => id !== friendId)
        : [...prev.memberIds, friendId];
      return { ...prev, memberIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setLoading(true);
    
    try {
      const response = await groupService.createGroup(formData);
      if (response.success) {
        toast.success('Group created successfully!');
        navigate('/groups');
      }
    } catch (error) {
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;

  // Responsive styles
  const containerStyle = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: isSmallMobile ? '10px' : isMobile ? '15px' : '0'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: isMobile ? '20px' : '25px',
    padding: isSmallMobile ? '20px' : isMobile ? '25px' : '40px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    marginTop: isMobile ? '10px' : '0'
  };

  const headingStyle = {
    fontSize: isSmallMobile ? '22px' : isMobile ? '24px' : '28px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 8px 0',
    textAlign: 'center',
    lineHeight: '1.3'
  };

  const subheadingStyle = {
    color: '#666',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: isMobile ? '14px' : '16px',
    lineHeight: '1.5'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600'
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '14px 16px' : '16px 20px',
    background: 'rgba(102, 126, 234, 0.05)',
    border: '2px solid rgba(102, 126, 234, 0.1)',
    borderRadius: '12px',
    color: '#333',
    fontSize: isMobile ? '15px' : '16px',
    transition: 'all 0.3s',
    boxSizing: 'border-box'
  };

  const friendsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isSmallMobile ? '1fr' : isMobile ? 'repeat(auto-fill, minmax(180px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: isMobile ? '12px' : '15px'
  };

  const friendCardStyle = {
    padding: isMobile ? '16px' : '20px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '12px' : '15px',
    minHeight: isMobile ? '70px' : 'auto'
  };

  const avatarStyle = {
    width: isMobile ? '44px' : '50px',
    height: isMobile ? '44px' : '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isMobile ? '16px' : '18px',
    transition: 'all 0.3s',
    flexShrink: 0
  };

  const friendNameStyle = {
    margin: '0 0 4px 0',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '600',
    lineHeight: '1.3',
    wordBreak: 'break-all'
  };

  const friendEmailStyle = {
    margin: 0,
    color: '#666',
    fontSize: isMobile ? '12px' : '13px',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-all'
  };

  const checkboxStyle = {
    width: isMobile ? '20px' : '24px',
    height: isMobile ? '20px' : '24px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: isMobile ? '10px' : '12px',
    fontWeight: 'bold',
    flexShrink: 0
  };

  const selectedCountStyle = {
    padding: isMobile ? '12px 16px' : '15px 20px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '10px',
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '12px' : '15px',
    flexDirection: isMobile ? 'column' : 'row'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: isMobile ? '12px' : '20px',
    marginTop: '30px',
    flexDirection: isMobile ? 'column' : 'row'
  };

  const cancelButtonStyle = {
    flex: 1,
    padding: isMobile ? '16px' : '18px',
    background: '#f3f4f6',
    color: '#666',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s',
    width: isMobile ? '100%' : 'auto'
  };

  const submitButtonStyle = {
    flex: isMobile ? 1 : 2,
    padding: isMobile ? '16px' : '18px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: '600',
    cursor: 'pointer',
    opacity: loading ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '8px' : '12px',
    transition: 'all 0.3s',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    width: isMobile ? '100%' : 'auto'
  };

  const emptyStateStyle = {
    padding: isMobile ? '30px 16px' : '40px 20px',
    textAlign: 'center',
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '12px',
    border: '2px dashed rgba(102, 126, 234, 0.2)'
  };

  return (
    <div style={containerStyle}>
      {/* Back Button for Mobile */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/groups')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#667eea',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '12px 0',
            marginBottom: '5px'
          }}
        >
          <span>←</span>
          Back to Groups
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <h2 style={headingStyle}>
          Create New Group
        </h2>
        <p style={subheadingStyle}>
          Create a group to easily share expenses with friends
        </p>

        <form onSubmit={handleSubmit}>
          {/* Group Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Roommates, Trip to Bali, Office Lunch"
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.1)';
                e.target.style.background = 'rgba(102, 126, 234, 0.05)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={isMobile ? "3" : "4"}
              style={{
                ...inputStyle,
                minHeight: isMobile ? '100px' : '120px',
                resize: 'vertical'
              }}
              placeholder="Describe the purpose of this group..."
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.1)';
                e.target.style.background = 'rgba(102, 126, 234, 0.05)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Select Members */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <label style={labelStyle}>
                Select Members
              </label>
              {formData.memberIds.length > 0 && (
                <span style={{
                  fontSize: '13px',
                  color: '#667eea',
                  fontWeight: '600',
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}>
                  {formData.memberIds.length} selected
                </span>
              )}
            </div>
            
            {friends.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={{
                  fontSize: isMobile ? '40px' : '48px',
                  marginBottom: '12px',
                  opacity: 0.3
                }}>
                  👥
                </div>
                <p style={{
                  color: '#666',
                  margin: '0 0 8px 0',
                  fontSize: isMobile ? '15px' : '16px'
                }}>
                  No friends yet
                </p>
                <p style={{
                  color: '#999',
                  fontSize: isMobile ? '13px' : '14px',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Add friends first to create a group
                </p>
              </div>
            ) : (
              <div style={friendsGridStyle}>
                {friends.map((friend) => {
                  const isSelected = formData.memberIds.includes(friend.receiver.id);
                  return (
                    <motion.div
                      key={friend.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMember(friend.receiver.id)}
                      style={{
                        ...friendCardStyle,
                        background: isSelected
                          ? 'rgba(102, 126, 234, 0.15)'
                          : 'rgba(102, 126, 234, 0.05)',
                        border: `2px solid ${
                          isSelected
                            ? '#667eea'
                            : 'rgba(102, 126, 234, 0.2)'
                        }`
                      }}
                    >
                      <div style={{
                        ...avatarStyle,
                        background: isSelected
                          ? '#667eea'
                          : 'rgba(102, 126, 234, 0.2)'
                      }}>
                        {friend.receiver?.username?.charAt(0).toUpperCase()}
                      </div>
                      
                      <div style={{ 
                        flex: 1,
                        minWidth: 0 // For text truncation
                      }}>
                        <h4 style={{
                          ...friendNameStyle,
                          color: isSelected ? '#667eea' : '#333'
                        }}>
                          {friend.receiver?.username}
                        </h4>
                        <p style={friendEmailStyle}>
                          {friend.receiver?.email}
                        </p>
                      </div>
                      
                      <div style={{
                        ...checkboxStyle,
                        background: isSelected ? '#667eea' : 'transparent',
                        border: isSelected ? 'none' : '2px solid #ddd'
                      }}>
                        {isSelected ? '✓' : ''}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Members Count - Full Width */}
          {formData.memberIds.length > 0 && (
            <div style={selectedCountStyle}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                width: isMobile ? '100%' : 'auto'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#10b981',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: isMobile ? '16px' : '18px',
                  flexShrink: 0
                }}>
                  👥
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: isMobile ? '14px' : '15px'
                  }}>
                    {formData.memberIds.length} member{formData.memberIds.length !== 1 ? 's' : ''} selected
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#666',
                    fontSize: isMobile ? '12px' : '13px',
                    lineHeight: '1.4'
                  }}>
                    You'll be added automatically as the group admin
                  </p>
                </div>
              </div>
              
              {!isMobile && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData(prev => ({ ...prev, memberIds: [] }))}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>🗑️</span>
                  Clear All
                </motion.button>
              )}
            </div>
          )}

          {/* Mobile Clear Button - Below the count */}
          {isMobile && formData.memberIds.length > 0 && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData(prev => ({ ...prev, memberIds: [] }))}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <span>🗑️</span>
              Clear Selected Members
            </motion.button>
          )}

          {/* Action Buttons */}
          <div style={buttonContainerStyle}>
            {!isMobile && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/groups')}
                style={cancelButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f3f4f6';
                }}
              >
                <span>←</span>
                Cancel
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading && !isMobile ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              style={submitButtonStyle}
            >
              {loading ? (
                <>
                  <div style={{
                    width: isMobile ? '20px' : '24px',
                    height: isMobile ? '20px' : '24px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Creating Group...
                </>
              ) : (
                <>
                  <span style={{ fontSize: isMobile ? '18px' : '20px' }}>+</span>
                  Create Group
                </>
              )}
            </motion.button>

            {isMobile && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/groups')}
                style={{
                  ...cancelButtonStyle,
                  marginTop: '10px'
                }}
              >
                <span>←</span>
                Back to Groups
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus, textarea:focus {
          outline: none;
        }
        body {
          background: #f5f7fa;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default GroupForm;