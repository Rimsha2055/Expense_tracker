import React, { useState } from 'react';
import FriendList from '../components/Friends/FriendList';
import AddFriend from '../components/Friends/AddFriend';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiUserPlus
} from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { 
      id: 'friends', 
      label: 'My Friends', 
      icon: <FiUsers size={20} />,
      description: 'Manage your friends list'
    },
    { 
      id: 'add', 
      label: 'Add Friend', 
      icon: <FiUserPlus size={20} />,
      description: 'Connect with new people'
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: isMobile ? '0 16px' : '0 24px' 
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: isMobile ? '24px' : '32px' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: isMobile ? '18px' : '24px',
          padding: isMobile ? '24px' : '32px',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <div style={{
                width: isMobile ? '56px' : '64px',
                height: isMobile ? '56px' : '64px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '24px' : '28px',
                color: '#fff'
              }}>
                <FaUserFriends />
              </div>
              <div>
                <h1 style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2'
                }}>
                  Friends Network
                </h1>
                <p style={{
                  fontSize: isMobile ? '14px' : '16px',
                  color: '#94a3b8',
                  margin: 0
                }}>
                  Connect with friends to share expenses and track balances
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: isMobile ? '24px' : '32px',
        flexWrap: 'wrap'
      }}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: isMobile ? '16px 24px' : '18px 28px',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' 
                : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab.id ? '#fff' : '#cbd5e1',
              border: `1px solid ${activeTab === tab.id ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '12px',
              fontSize: isMobile ? '14px' : '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)',
              flex: isMobile ? 1 : 'none',
              minWidth: isMobile ? '140px' : '180px',
              justifyContent: 'center'
            }}
          >
            <span style={{ 
              fontSize: isMobile ? '18px' : '20px',
              opacity: activeTab === tab.id ? 1 : 0.8
            }}>
              {tab.icon}
            </span>
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'friends' && <FriendList />}
        {activeTab === 'add' && <AddFriend />}
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .tab-button {
            min-width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          .header-title {
            font-size: 22px !important;
          }
          
          .tab-content {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FriendsPage;