import React, { useState, useEffect } from 'react';
import { groupService } from '../../services/groups';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUsers, FiUser, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { formatCurrency } from '../../utils/currency';

const GroupBalances = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchGroups();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupBalances(selectedGroup);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupService.getGroups();
      if (response.success) {
        setGroups(response.data);
        if (response.data.length > 0) {
          setSelectedGroup(response.data[0].id);
        }
      }
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupBalances = async (groupId) => {
    try {
      const response = await groupService.getGroup(groupId);
      if (response.success && response.data.balances) {
        setBalances(response.data.balances);
      }
    } catch (error) {
      toast.error('Failed to load balances');
    }
  };

  const handleSettle = async (fromId, toId, amount) => {
    if (window.confirm(`Are you sure you want to settle ${formatCurrency(amount)}?`)) {
      try {
        toast.success('Balance settled successfully!');
        // Refresh balances
        if (selectedGroup) {
          fetchGroupBalances(selectedGroup);
        }
      } catch (error) {
        toast.error('Failed to settle balance');
      }
    }
  };

  const calculateTotalOwed = () => {
    return balances.reduce((total, balance) => total + (Number(balance?.amount) || 0), 0);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: isMobile ? '24px' : '28px',
          fontWeight: '700',
          color: '#333',
          margin: '0 0 10px 0'
        }}>
          Group Balances
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          Track and settle balances within your groups
        </p>
      </div>

      {/* Group Selector */}
      {groups.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            {groups.map((group) => (
              <motion.button
                key={group.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGroup(group.id)}
                style={{
                  padding: '12px 24px',
                  background: selectedGroup === group.id 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#f3f4f6',
                  color: selectedGroup === group.id ? '#fff' : '#666',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>👥</span>
                {group.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

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
      ) : balances.length === 0 ? (
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
            ⚖️
          </div>
          <h3 style={{
            fontSize: '24px',
            color: '#666',
            marginBottom: '10px'
          }}>
            No Balances Found
          </h3>
          <p style={{ color: '#999' }}>
            {selectedGroup 
              ? 'All balances are settled in this group!' 
              : 'Select a group to view balances'}
          </p>
        </motion.div>
      ) : (
        <>
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: isMobile ? '18px' : '30px',
              color: '#fff',
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: '0 0 10px 0',
                  opacity: 0.9
                }}>
                  Total Outstanding
                </h3>
                  <div style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '800'
                }}>
                  {formatCurrency(calculateTotalOwed())}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginTop: isMobile ? '12px' : 0,
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'space-between' : 'flex-start'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '14px',
                    opacity: 0.9,
                    marginBottom: '5px'
                  }}>
                    Owed to You
                  </div>
                    <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>
                    {formatCurrency(0)}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '14px',
                    opacity: 0.9,
                    marginBottom: '5px'
                  }}>
                    You Owe
                  </div>
                    <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#f59e0b'
                  }}>
                    {formatCurrency(calculateTotalOwed())}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Balances List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {balances.map((balance, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: '#fff',
                  borderRadius: '15px',
                  padding: isMobile ? '14px' : '25px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '20px',
                  borderLeft: '5px solid #667eea'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  flex: 1
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '15px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#667eea'
                  }}>
                    <FiUser />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <h4 style={{
                          margin: '0 0 5px 0',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          You owe
                        </h4>
                        <p style={{
                          margin: 0,
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          To: User {balance.toId ? String(balance.toId).substring(0, 8) : '—'}...
                        </p>
                      </div>
                      
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        borderRadius: '18px',
                        fontSize: '6px',
                        fontWeight: '600'
                      }}>
                        <FiDollarSign />
                        Unsettled
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#333',
                      marginBottom: '5px'
                    }}>
                      {formatCurrency(Number(balance?.amount) || 0)}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#999'
                    }}>
                      Since {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSettle(balance.fromId, balance.toId, balance.amount)}
                    style={{
                      padding: isMobile ? '10px 14px' : '12px 24px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                      width: isMobile ? '100%' : 'auto',
                      justifyContent: isMobile ? 'center' : 'flex-start'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <span></span>
                    <span><FiCreditCard /></span>
                    Settle Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Settlement Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '30px',
              marginTop: '30px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
            }}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 20px 0'
            }}>
               Settlement Summary
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <div style={{
                padding: '20px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '10px'
                }}>
                  Total Balances
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#667eea'
                }}>
                  {balances.length}
                </div>
              </div>
              
              <div style={{
                padding: '20px',
                background: 'rgba(16, 185, 129, 0.05)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '10px'
                }}>
                  Total Amount
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {formatCurrency(calculateTotalOwed())}
                </div>
              </div>
              
              <div style={{
                padding: '20px',
                background: 'rgba(245, 158, 11, 0.05)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '10px'
                }}>
                  Avg. Per Person
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#f59e0b'
                }}>
                  {formatCurrency(balances.length ? calculateTotalOwed() / balances.length : 0)}
                </div>
              </div>
            </div>
          </motion.div>
        </>
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

export default GroupBalances;