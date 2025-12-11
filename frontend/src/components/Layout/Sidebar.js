import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analytics';
import { 
  FiHome,
  FiCreditCard,
  FiTrendingUp,
  FiUsers,
  FiChevronRight
} from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose, isMobile, isTablet }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchQuickStats = async () => {
      try {
        const [balRes, expRes, grpRes] = await Promise.all([
          analyticsService.getUserBalance(),
          analyticsService.getUserExpensesCount(),
          analyticsService.getUserGroupsCount()
        ]);

        if (!mounted) return;

        if (balRes?.success) setBalance(balRes.data?.net || 0);
        if (expRes?.success) setExpensesCount(expRes.data?.count || 0);
        if (grpRes?.success) setGroupsCount(grpRes.data?.count || 0);
      } catch (err) {
        console.error('Failed to load quick stats', err);
      }
    };
    fetchQuickStats();
    return () => { mounted = false; };
  }, []);

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: <FiHome />, 
      label: 'Dashboard', 
      color: '#3b82f6',
      badge: null
    },
    { 
      path: '/expenses', 
      icon: <FiCreditCard />, 
      label: 'Expenses', 
      color: '#10b981',
      badge: expensesCount > 0 ? expensesCount : null
    },
    { 
      path: '/analytics', 
      icon: <FiTrendingUp />, 
      label: 'Analytics', 
      color: '#8b5cf6',
      badge: null
    },
    { 
      path: '/friends', 
      icon: <FaUserFriends />, 
      label: 'Friends', 
      color: '#f59e0b',
      badge: null
    },
    { 
      path: '/groups', 
      icon: <FiUsers />, 
      label: 'Groups', 
      color: '#ef4444',
      badge: groupsCount > 0 ? groupsCount : null
    }
  ];

  return (
    <AnimatePresence>
      {(isOpen || !isMobile) && (
        <motion.aside
          initial={{ x: (isMobile || isTablet) ? -300 : 0, opacity: (isMobile || isTablet) ? 0 : 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: (isMobile || isTablet) ? -300 : 0, opacity: (isMobile || isTablet) ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: (isMobile || isTablet) ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            bottom: 0,
            width: isMobile ? '280px' : isTablet ? '260px' : '280px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {/* Profile Section */}
          <div style={{ 
            padding: isMobile ? '24px 20px' : '30px 25px', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {/* Background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? '14px' : '16px', 
              marginBottom: '20px',
              position: 'relative',
              zIndex: 1
            }}>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                style={{
                  width: isMobile ? '52px' : '60px',
                  height: isMobile ? '52px' : '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '20px' : '24px',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </motion.div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ 
                  color: '#fff', 
                  margin: 0, 
                  fontSize: isMobile ? '16px' : '18px', 
                  fontWeight: 700, 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  letterSpacing: '-0.5px'
                }}>
                  {user?.username || 'User'}
                </h3>
                <p style={{ 
                  color: '#94a3b8', 
                  margin: '4px 0 0 0', 
                  fontSize: isMobile ? '12px' : '13px', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  fontWeight: '400'
                }}>
                  {user?.email || 'premium@finflow.com'}
                </p>
                <div style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '3px 10px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  fontSize: '10px',
                  color: '#60a5fa',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  PREMIUM USER
                </div>
              </div>
            </div>
            
            {/* Quick Stats - Fixed display */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: isMobile ? '10px' : '12px', 
              padding: isMobile ? '12px' : '14px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              marginTop: '15px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              zIndex: 1
            }}>
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                style={{ 
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
                onClick={() => navigate('/dashboard')}
              >
                <div style={{ 
                  fontSize: isMobile ? '10px' : '11px', 
                  color: '#94a3b8', 
                  marginBottom: '4px', 
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Balance
                </div>
                <div style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  fontWeight: 700, 
                  color: '#10b981',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {new Intl.NumberFormat('en-PK', { 
                    style: 'currency', 
                    currency: 'PKR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(Number(balance) || 0)}
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                style={{ 
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
                onClick={() => navigate('/expenses')}
              >
                <div style={{ 
                  fontSize: isMobile ? '10px' : '11px', 
                  color: '#94a3b8', 
                  marginBottom: '4px', 
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Expenses
                </div>
                <div style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  fontWeight: 700, 
                  color: '#f59e0b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {expensesCount}
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                style={{ 
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
                onClick={() => navigate('/groups')}
              >
                <div style={{ 
                  fontSize: isMobile ? '10px' : '11px', 
                  color: '#94a3b8', 
                  marginBottom: '4px', 
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Groups
                </div>
                <div style={{ 
                  fontSize: isMobile ? '12px' : '14px', 
                  fontWeight: 700, 
                  color: '#8b5cf6',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {groupsCount}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Navigation Menu - Takes remaining space */}
          <nav style={{ 
            flex: 1,
            padding: isMobile ? '20px 0' : '25px 0', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px', 
            overflowY: 'auto',
            position: 'relative',
            zIndex: 1,
            minHeight: 0
          }}>
            <div style={{ padding: '0 20px', marginBottom: '10px', flexShrink: 0 }}>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '11px', 
                fontWeight: '600', 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: '0 0 15px 0'
              }}>
                Main Menu
              </p>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {menuItems.map((item) => (
                <div key={item.path} style={{ position: 'relative', marginBottom: '4px' }}>
                  <NavLink
                    to={item.path}
                    onClick={() => isMobile && onClose()}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: isMobile ? '12px 20px' : '14px 25px',
                      color: isActive ? '#fff' : '#cbd5e1',
                      textDecoration: 'none',
                      background: isActive ? item.color : 'transparent',
                      fontSize: isMobile ? '14px' : '15px',
                      fontWeight: isActive ? '600' : '500',
                      borderRadius: '10px',
                      margin: '0 12px',
                      border: isActive ? `1px solid ${item.color}80` : '1px solid transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0
                    })}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.className.includes('active')) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.className.includes('active')) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
                        e.currentTarget.style.border = '1px solid transparent';
                      }
                    }}
                  >
                    {/* Background glow for active item */}
                    {({ isActive }) => isActive && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at center, ${item.color}20 0%, transparent 70%)`,
                        zIndex: 0
                      }} />
                    )}

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      position: 'relative',
                      zIndex: 1,
                      flex: 1,
                      minWidth: 0
                    }}>
                      <span style={{ 
                        fontSize: '16px', 
                        color: ({ isActive }) => isActive ? '#fff' : item.color,
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </span>
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                      }}>
                        {item.label}
                      </span>
                    </div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span style={{
                        background: item.color,
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '20px',
                        minWidth: '20px',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1,
                        boxShadow: `0 2px 8px ${item.color}40`,
                        flexShrink: 0,
                        marginLeft: '8px'
                      }}>
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Chevron for hover effect */}
                    <FiChevronRight style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.3)',
                      opacity: 0,
                      transition: 'all 0.3s',
                      position: 'relative',
                      zIndex: 1,
                      flexShrink: 0,
                      marginLeft: '8px'
                    }} />
                  </NavLink>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer - Simple copyright only */}
          <div style={{ 
            padding: '16px 20px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)',
            flexShrink: 0
          }}>
            <div style={{ 
              fontSize: '11px', 
              color: '#64748b', 
              textAlign: 'center',
              fontWeight: '400',
              letterSpacing: '0.5px'
            }}>
              © {new Date().getFullYear()}BudgetBuddy
            </div>
          </div>

          {/* Custom scrollbar styling */}
          <style>{`
            nav::-webkit-scrollbar {
              width: 4px;
            }
            
            nav::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 4px;
            }
            
            nav::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 4px;
            }
            
            nav::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;