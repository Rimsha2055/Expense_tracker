import React, { useState } from 'react';
import GroupList from '../components/Groups/GroupList';
import GroupForm from '../components/Groups/GroupForm';
import GroupBalances from '../components/Groups/GroupBalances';
import { motion } from 'framer-motion';

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState('groups');

  const tabs = [
    { id: 'groups', label: 'My Groups', icon: '👥' },
    { id: 'create', label: 'Create Group', icon: '➕' },
    { id: 'balances', label: 'Balances', icon: '⚖️' }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          borderRadius: '20px',
          padding: '40px 30px',
          color: '#ffffff',
          boxShadow: '0 20px 60px rgba(30, 64, 175, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle pattern overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            opacity: 0.3
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: '800',
              margin: '0 0 15px 0',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Expense Groups
            </h1>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              opacity: 0.9,
              margin: 0,
              maxWidth: '600px',
              lineHeight: '1.6',
              color: '#cbd5e1'
            }}>
              Create and manage groups to easily split expenses with friends and family
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '20px 32px',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                : 'rgba(30, 41, 59, 0.8)',
              color: activeTab === tab.id ? '#ffffff' : '#cbd5e1',
              border: activeTab === tab.id 
                ? 'none' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id 
                ? '0 10px 30px rgba(37, 99, 235, 0.4)' 
                : '0 4px 20px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              flex: '1',
              minWidth: '200px',
              maxWidth: '300px',
              justifyContent: 'center',
              letterSpacing: '0.3px'
            }}
          >
            <span style={{ 
              fontSize: '22px',
              filter: activeTab === tab.id ? 'brightness(1.2)' : 'brightness(1)'
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          minHeight: '400px'
        }}
      >
        {activeTab === 'groups' && <GroupList />}
        {activeTab === 'create' && <GroupForm />}
        {activeTab === 'balances' && <GroupBalances />}
      </motion.div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .tabs-container {
            flex-direction: column;
            align-items: stretch;
          }
          .tab-button {
            min-width: 100%;
            max-width: 100%;
          }
          .content-container {
            padding: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .header-content {
            padding: 30px 20px;
          }
          .content-container {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default GroupsPage;