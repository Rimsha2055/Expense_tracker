import React, { useState, useEffect } from 'react';
import { groupService } from '../../services/groups';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiStar, FiDollarSign, FiUser } from 'react-icons/fi';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupService.getGroups();
      if (response.success) {
        setGroups(response.data);
      }
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
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
            Groups
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            Create and manage expense-sharing groups
          </p>
        </div>

        {/* Create New Group button removed per UI request */}
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
      ) : groups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '20px',
            border: '2px dashed #ddd'
          }}
        >
          <div style={{
            fontSize: '80px',
            marginBottom: '20px',
            opacity: 0.3,
            animation: 'float 3s ease-in-out infinite'
          }}>
            👨‍👩‍👧‍👦
          </div>
          <h3 style={{
            fontSize: '24px',
            color: '#666',
            marginBottom: '10px',
            fontWeight: '600'
          }}>
            No Groups Yet
          </h3>
          <p style={{
            color: '#999',
            fontSize: '16px',
            marginBottom: '30px',
            maxWidth: '500px',
            margin: '0 auto 30px'
          }}>
            Create your first group to start sharing expenses.
            <span style={{ marginLeft: 8 }}><FiUserPlus /></span>
          </p>
        </motion.div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/groups/${group.id}`)}
              style={{
                background: '#fff',
                borderRadius: '25px',
                padding: '30px',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '0 25px 0 100px'
              }} />

              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    color: '#fff'
                  }}>
                    {group.name?.charAt(0) || 'G'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#333'
                    }}>
                      {group.name}
                    </h3>

                    <p style={{
                      margin: 0,
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      {group.description || 'No description provided'}
                    </p>

                    <FiStar />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <FiUser style={{ color: '#667eea' }} />
                    {group.creator?.username}
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <FiUsers style={{ color: '#10b981' }} />
                    {group.members?.length || 0} members
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#f59e0b'
                  }}>
                    <FiDollarSign />
                    {'Rs ' + (group.totalExpenses || '0.00')}
                  </div>
                </div>
              </div> {/* ← FIXED: THIS DIV WAS MISSING */}

              {/* Stats removed: hiding Total Expenses, Pending Settlements and Created On to simplify card view */}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  color: '#667eea',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                👁️ View Group Details
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default GroupList;
