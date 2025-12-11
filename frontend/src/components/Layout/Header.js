import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FiMenu, 
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import { 
  FaChartLine
} from 'react-icons/fa';

const Header = ({ onMenuClick, isMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatName = (name) => {
    return name?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || 'U';
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        padding: isMobile ? '15px 20px' : '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '15px' : '30px' }}>
        {/* Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
        >
          <FiMenu />
        </motion.button>
        
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
          }}>
            <FaChartLine size={22} />
          </div>
          {!isMobile && (
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#fff',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                Budget<span style={{ color: '#60a5fa' }}>Buddy</span>
              </h1>
              <p style={{
                fontSize: '11px',
                color: '#94a3b8',
                margin: '2px 0 0 0',
                fontWeight: '500',
                letterSpacing: '1px'
              }}>
             
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Section - Only User Profile */}
      <div style={{ position: 'relative' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '2px solid rgba(96, 165, 250, 0.3)'
          }}>
            <FiUser size={18} />
          </div>
          {!isMobile && (
            <div>
              <p style={{ 
                margin: 0, 
                color: '#fff', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {user?.fullName || user?.username || 'Welcome'}
              </p>
              <p style={{ 
                margin: '2px 0 0 0', 
                color: '#94a3b8', 
                fontSize: '12px',
                fontWeight: '400'
              }}>
                {user?.email || 'Premium User'}
              </p>
            </div>
          )}
          <div style={{
            width: '0', 
            height: '0', 
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #94a3b8',
            transition: 'transform 0.3s',
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)'
          }} />
        </motion.div>

        {/* Dropdown Menu - Only Logout */}
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '10px',
              background: '#1e293b',
              borderRadius: '15px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              width: '280px',
              zIndex: 1001,
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* User Info */}
            <div style={{ 
              padding: '20px', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {formatName(user?.fullName || user?.username)}
                </div>
                <div>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    color: '#fff', 
                    fontWeight: '600',
                    fontSize: '15px'
                  }}>
                    {user?.fullName || user?.username || 'Premium User'}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    color: '#94a3b8', 
                    fontSize: '12px'
                  }}>
                    {user?.email || 'Enterprise Plan'}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    padding: '2px 8px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: '#60a5fa',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    PREMIUM
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <div style={{ 
              padding: '15px 0', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(239, 68, 68, 0.05)'
            }}>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  color: '#f87171',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.target.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#f87171';
                }}
              >
                <FiLogOut style={{ fontSize: '16px' }} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;