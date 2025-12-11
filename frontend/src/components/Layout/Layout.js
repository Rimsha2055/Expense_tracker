import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-open sidebar on desktop, close on mobile/tablet
      if (width >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: 'transparent'
    }}>
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        isMobile={isMobile}
        isTablet={isTablet}
      />
      
      <div style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        width: '100%'
      }}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile}
          isTablet={isTablet}
        />
        
        {/* Mobile/Tablet Overlay */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 98,
                transition: 'opacity 0.3s ease'
              }}
            />
          )}
        </AnimatePresence>
        
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            flex: 1,
            padding: isMobile ? 'var(--spacing-md)' : isTablet ? 'var(--spacing-lg)' : 'var(--spacing-xl)',
            marginLeft: !isMobile && !isTablet && sidebarOpen ? '280px' : '0',
            transition: 'margin-left 0.3s ease, padding 0.3s ease',
            maxWidth: '100%',
            overflowX: 'hidden',
            width: '100%',
            minHeight: 'calc(100vh - 80px)'
          }}
        >
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%'
          }}>
            {children}
          </div>
        </motion.main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;