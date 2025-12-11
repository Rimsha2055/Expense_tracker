import React from 'react';

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        marginBottom: '30px'
      }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '8px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          borderTop: '8px solid #fff',
          animation: 'spin 1s linear infinite'
        }} />
        
        {/* Middle ring */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '70%',
          height: '70%',
          border: '6px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          borderTop: '6px solid #fff',
          animation: 'spin 1.5s linear infinite reverse'
        }} />
        
        {/* Inner ring */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '30%',
          width: '40%',
          height: '40%',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          borderTop: '4px solid #fff',
          animation: 'spin 2s linear infinite'
        }} />
      </div>
      
      <h2 style={{
        fontSize: '28px',
        fontWeight: '600',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        Expense Tracker
      </h2>
      <p style={{
        fontSize: '16px',
        opacity: 0.8,
        textAlign: 'center'
      }}>
        Loading your financial dashboard...
      </p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;