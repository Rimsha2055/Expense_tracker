import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style = {},
  className = '',
  ...props
}) => {
  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          hoverEffect: {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4192 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
            transform: 'translateY(-2px)'
          }
        };
      
      case 'secondary':
        return {
          background: '#fff',
          color: '#667eea',
          border: '2px solid #667eea',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
          hoverEffect: {
            background: '#667eea',
            color: '#fff',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)',
            transform: 'translateY(-2px)'
          }
        };
      
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
          hoverEffect: {
            background: 'linear-gradient(135deg, #0ea271 0%, #047857 100%)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            transform: 'translateY(-2px)'
          }
        };
      
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
          hoverEffect: {
            background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)',
            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
            transform: 'translateY(-2px)'
          }
        };
      
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
          hoverEffect: {
            background: 'linear-gradient(135deg, #e5940a 0%, #c46b05 100%)',
            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
            transform: 'translateY(-2px)'
          }
        };
      
      case 'ghost':
        return {
          background: 'transparent',
          color: '#667eea',
          border: '2px solid transparent',
          boxShadow: 'none',
          hoverEffect: {
            background: 'rgba(102, 126, 234, 0.1)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
            transform: 'translateY(-2px)'
          }
        };
      
      case 'outline':
        return {
          background: 'transparent',
          color: '#667eea',
          border: '2px solid #667eea',
          boxShadow: 'none',
          hoverEffect: {
            background: 'rgba(102, 126, 234, 0.1)',
            transform: 'translateY(-2px)'
          }
        };
      
      default:
        return {
          background: '#f3f4f6',
          color: '#374151',
          border: '2px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          hoverEffect: {
            background: '#e5e7eb',
            transform: 'translateY(-2px)'
          }
        };
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '600',
          borderRadius: '8px',
          gap: '6px'
        };
      
      case 'medium':
        return {
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '10px',
          gap: '8px'
        };
      
      case 'large':
        return {
          padding: '16px 32px',
          fontSize: '16px',
          fontWeight: '600',
          borderRadius: '12px',
          gap: '12px'
        };
      
      default:
        return {
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '10px',
          gap: '8px'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.3s ease',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    ...variantStyles,
    ...sizeStyles,
    ...style
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading && variantStyles.hoverEffect) {
      Object.entries(variantStyles.hoverEffect).forEach(([property, value]) => {
        e.target.style[property] = value;
      });
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.target.style.background = variantStyles.background;
      e.target.style.color = variantStyles.color;
      e.target.style.border = variantStyles.border;
      e.target.style.boxShadow = variantStyles.boxShadow;
      e.target.style.transform = 'translateY(0)';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      style={baseStyles}
      className={`custom-button ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: variantStyles.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: sizeStyles.borderRadius
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: `3px solid rgba(255, 255, 255, 0.3)`,
            borderTop: `3px solid ${variant === 'ghost' || variant === 'outline' ? '#667eea' : '#fff'}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {/* Icon */}
      {icon && iconPosition === 'left' && !loading && (
        <span style={{ 
          fontSize: size === 'small' ? '14px' : size === 'large' ? '20px' : '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {icon}
        </span>
      )}

      {/* Button Text */}
      <span style={{ 
        opacity: loading ? 0 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: sizeStyles.gap
      }}>
        {children}
      </span>

      {/* Icon */}
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ 
          fontSize: size === 'small' ? '14px' : size === 'large' ? '20px' : '16px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {icon}
        </span>
      )}

      {/* Ripple Effect */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        .custom-button::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1%, transparent 1%);
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .custom-button:active::after {
          background-size: 10000%;
          opacity: 1;
          transition: background-size 0.6s, opacity 0.3s;
        }
      `}</style>
    </motion.button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, direction = 'horizontal', spacing = 8, style = {} }) => {
  const groupStyles = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: spacing,
    alignItems: direction === 'vertical' ? 'stretch' : 'center',
    ...style
  };

  return <div style={groupStyles}>{children}</div>;
};

// Icon Button Component
export const IconButton = ({ icon, ...props }) => {
  return (
    <Button
      icon={icon}
      style={{
        width: 'auto',
        height: 'auto',
        padding: '12px',
        borderRadius: '50%',
        aspectRatio: '1/1'
      }}
      {...props}
    />
  );
};

export default Button;