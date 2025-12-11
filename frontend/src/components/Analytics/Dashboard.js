import React, { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenses';
import { analyticsService } from '../../services/analytics';
import StatsCards from './StatsCards';
import PieChart from './PieChart';
import SpendingChart from './SpendingChart';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/currency';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, analyticsResponse] = await Promise.all([
        expenseService.getExpenseStats(),
        analyticsService.getSpendingAnalytics(period)
      ]);

      if (statsResponse.success) setStats(statsResponse.data);
      if (analyticsResponse.success) setAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, [period]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af)'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#666', fontSize: '16px', textAlign: 'center' }}>
        Loading your analytics dashboard...
      </p>
      <style>{`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      padding: isMobile ? '10px' : '15px',
      background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #1e3a8a10)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: isMobile ? '15px' : '25px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '15px',
            alignItems: isMobile ? 'flex-start' : 'center'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontSize: isMobile ? '20px' : isTablet ? '24px' : '28px',
                fontWeight: 600,
                margin: '0 0 8px 0',
                lineHeight: '1.2',
                background: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>Analytics Dashboard</h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? '13px' : '15px', margin: 0 }}>
                Track and analyze your spending patterns
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              background: 'rgba(255,255,255,0.06)',
              padding: '6px',
              borderRadius: '10px',
              backdropFilter: 'blur(8px)',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              width: isMobile ? '100%' : 'auto'
            }}>
              {periods.map((p) => (
                <motion.button
                  key={p.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPeriod(p.value)}
                  style={{
                    padding: '8px 14px',
                    background: period === p.value ? '#1e3a8a' : 'transparent',
                    color: period === p.value ? '#fff' : 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: '0.3s ease',
                    whiteSpace: 'nowrap',
                    flex: isMobile ? '1 1 calc(50% - 6px)' : '0 1 auto'
                  }}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} compact={true} />}

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? '15px' : '25px',
          marginTop: '25px'
        }}>
          {analytics?.categorySpending && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: isMobile ? '15px' : '20px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
                <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#333', margin: 0 }}>Spending by Category</h3>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                  Total: {formatCurrency(analytics?.summary?.totalSpent || 0)}
                </div>
              </div>
              <PieChart data={analytics.categorySpending} compact={true} />
            </motion.div>
          )}

          {analytics?.dailyTrend && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: isMobile ? '15px' : '20px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
              }}
            >
              <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#333', marginBottom: '15px' }}>Daily Spending Trend</h3>
              <SpendingChart data={analytics.dailyTrend} compact={true} />
            </motion.div>
          )}
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: isMobile ? '15px' : '20px',
            marginTop: '25px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
          }}
        >
          <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#333', marginBottom: '15px' }}>Recent Transactions</h3>
          {analytics?.dailyTrend?.slice(-5).reverse().map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '10px',
                background: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: isMobile ? '35px' : '40px',
                  height: isMobile ? '35px' : '40px',
                  background: 'rgba(102,126,234,0.1)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#667eea',
                  flexShrink: 0
                }}>📊</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: 0, color: '#333', fontWeight: '600', fontSize: isMobile ? '13px' : '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: isMobile ? 'short' : 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <p style={{ margin: 0, color: '#999', fontSize: '11px' }}>
                    {day.count} transaction{day.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: isMobile ? 'left' : 'right', flexShrink: 0 }}>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                  {formatCurrency(parseFloat(day.total))}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#10b981',
                  fontWeight: '600',
                  background: 'rgba(16,185,129,0.1)',
                  padding: '3px 8px',
                  borderRadius: '16px',
                  display: 'inline-block'
                }}>
                  Avg: {(parseFloat(day.total) / day.count).toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
