import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 4000,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { top: '20px', left: '20px' };
      case 'top-center':
        return { top: '20px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      case 'bottom-center':
        return { bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { bottom: '20px', right: '20px' };
      default:
        return { top: '20px', right: '20px' };
    }
  };

  const getContainerStyles = () => {
    return {
      position: 'fixed',
      ...getPositionStyles(),
      background: '#fff',
      borderRadius: '12px',
      padding: isMobile ? '16px' : '18px 24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      width: isMobile ? 'calc(100% - 40px)' : 'auto',
      minWidth: isMobile ? 'unset' : '300px',
      maxWidth: isMobile ? 'calc(100% - 40px)' : '400px',
      borderLeft: `4px solid ${getColor()}`,
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: position.includes('top') ? -20 : 20,
            scale: 0.9 
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: 1 
          }}
          exit={{ 
            opacity: 0, 
            y: position.includes('top') ? -20 : 20,
            scale: 0.9 
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={getContainerStyles()}
        >
          {/* Icon */}
          <div style={{
            width: '40px',
            height: '40px',
            background: `${getColor()}15`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: getColor(),
            flexShrink: 0
          }}>
            {getIcon()}
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <h4 style={{
              margin: '0 0 5px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666',
              lineHeight: 1.5
            }}>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            style={{
              background: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '18px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.1)';
              e.target.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.05)';
              e.target.style.color = '#666';
            }}
          >
            ✕
          </motion.button>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: getColor(),
              borderRadius: '0 0 12px 12px',
              transformOrigin: 'left center'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Container Component
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now().toString();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration),
    custom: (message, type, duration) => showToast(message, type, duration)
  };

  // Expose toast methods globally
  if (typeof window !== 'undefined') {
    window.toast = toast;
  }

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

// Hook for using toast
export const useToast = () => {
  return {
    success: (message, duration) => {
      if (window.toast) window.toast.success(message, duration);
    },
    error: (message, duration) => {
      if (window.toast) window.toast.error(message, duration);
    },
    warning: (message, duration) => {
      if (window.toast) window.toast.warning(message, duration);
    },
    info: (message, duration) => {
      if (window.toast) window.toast.info(message, duration);
    },
    custom: (message, type, duration) => {
      if (window.toast) window.toast.custom(message, type, duration);
    }
  };
};

export default Toast;