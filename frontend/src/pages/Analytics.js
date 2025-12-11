import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/currency';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiBarChart2, 
  FiPieChart,
  FiCalendar,
  FiTarget,
  FiDollarSign,
  FiCreditCard,
  FiActivity
} from 'react-icons/fi';
import { FaChartLine, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getSpendingAnalytics(period);
      if (response.success) {
        setAnalytics(response.data);
      } else {
        toast.error('Failed to load analytics data');
      }
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const periodLabels = {
    'week': 'Weekly',
    'month': 'Monthly',
    'quarter': 'Quarterly',
    'year': 'Yearly'
  };

  return (
    <div style={{ 
      maxWidth: '1400px', 
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: isMobile ? '48px' : '56px',
                height: isMobile ? '48px' : '56px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '20px' : '24px',
                color: '#fff'
              }}>
                <FaChartLine />
              </div>
              <div>
                <h1 style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2'
                }}>
                  Financial Analytics
                </h1>
                <p style={{
                  fontSize: isMobile ? '14px' : '16px',
                  color: '#94a3b8',
                  margin: 0
                }}>
                  Advanced insights into your spending patterns
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '24px'
            }}>
              {['week', 'month', 'quarter', 'year'].map((p) => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: isMobile ? '10px 20px' : '12px 24px',
                    background: period === p 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: period === p ? '#fff' : '#cbd5e1',
                    border: `1px solid ${period === p ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '10px',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)',
                    minWidth: isMobile ? '80px' : '90px',
                    textAlign: 'center'
                  }}
                >
                  {periodLabels[p]}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Content */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '60px 20px' : '100px 20px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '24px'
          }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#fff', 
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Loading Analytics
            </p>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '14px',
              margin: 0
            }}>
              Processing your financial data...
            </p>
          </div>
        </motion.div>
      ) : analytics ? (
        <>
          {/* Summary Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: isMobile ? '16px' : '24px',
            marginBottom: isMobile ? '24px' : '32px'
          }}>
            {[
              {
                title: 'Total Spent',
                value: formatCurrency(analytics.summary?.totalSpent || 0),
                icon: <FiDollarSign />,
                color: '#3b82f6',
                change: `+${analytics.summary?.monthlyComparison?.changePercentage?.toFixed(1) || '0.0'}%`,
                trend: 'up'
              },
              {
                title: 'Transactions',
                value: analytics.summary?.totalTransactions || 0,
                icon: <FiCreditCard />,
                color: '#8b5cf6',
                change: '+15.2%',
                trend: 'up'
              },
              {
                title: 'Avg/Transaction',
                value: formatCurrency(analytics.summary?.averagePerTransaction || 0),
                icon: <FaChartPie />,
                color: '#10b981',
                change: '-3.4%',
                trend: 'down'
              },
              {
                title: 'Top Category',
                value: analytics.categorySpending?.[0]?.categoryName?.substring(0, 12) || 'None',
                icon: <FiBarChart2 />,
                color: '#f59e0b',
                change: analytics.categorySpending?.[0] 
                  ? formatCurrency(analytics.categorySpending[0].total) 
                  : formatCurrency(0),
                trend: 'neutral'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: isMobile ? '16px' : '20px',
                  padding: isMobile ? '20px' : '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: isMobile ? '16px' : '20px'
                }}>
                  <div style={{
                    width: isMobile ? '44px' : '52px',
                    height: isMobile ? '44px' : '52px',
                    background: `${stat.color}20`,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '20px' : '24px',
                    color: stat.color,
                    border: `1px solid ${stat.color}30`
                  }}>
                    {stat.icon}
                  </div>
                  
                  {/* Trend indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: stat.trend === 'up' 
                      ? 'rgba(16, 185, 129, 0.2)' 
                      : stat.trend === 'down'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '20px',
                    border: `1px solid ${
                      stat.trend === 'up' 
                        ? 'rgba(16, 185, 129, 0.3)' 
                        : stat.trend === 'down'
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(148, 163, 184, 0.3)'
                    }`
                  }}>
                    {stat.trend === 'up' ? (
                      <FiTrendingUp size={14} color="#10b981" />
                    ) : stat.trend === 'down' ? (
                      <FiTrendingDown size={14} color="#ef4444" />
                    ) : (
                      <FiActivity size={14} color="#94a3b8" />
                    )}
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: stat.trend === 'up' 
                        ? '#10b981' 
                        : stat.trend === 'down'
                        ? '#ef4444'
                        : '#94a3b8'
                    }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p style={{
                    margin: '0 0 8px 0',
                    color: '#94a3b8',
                    fontSize: isMobile ? '12px' : '13px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {stat.title}
                  </p>
                  <h3 style={{
                    margin: 0,
                    fontSize: isMobile ? '22px' : '28px',
                    fontWeight: '700',
                    color: '#fff',
                    lineHeight: '1.2'
                  }}>
                    {stat.value}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Category Breakdown */}
          {analytics.categorySpending && analytics.categorySpending.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: isMobile ? '18px' : '24px',
                padding: isMobile ? '24px' : '32px',
                marginBottom: isMobile ? '24px' : '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <FiPieChart size={24} color="#8b5cf6" />
                <h3 style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontWeight: '700',
                  color: '#fff',
                  margin: 0
                }}>
                  Category Breakdown
                </h3>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {analytics.categorySpending.map((category, index) => {
                  const percentage = (category.total / (analytics.summary?.totalSpent || 1)) * 100;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ x: 10 }}
                      style={{
                        padding: isMobile ? '16px' : '20px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <div style={{
                            width: isMobile ? '36px' : '44px',
                            height: isMobile ? '36px' : '44px',
                            background: category.color || '#3b82f6',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: isMobile ? '16px' : '18px',
                            color: '#fff',
                            flexShrink: 0
                          }}>
                            {category.icon || '🏷️'}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 style={{
                              margin: '0 0 4px 0',
                              fontSize: isMobile ? '14px' : '15px',
                              fontWeight: '600',
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {category.categoryName}
                            </h4>
                            <p style={{
                              margin: 0,
                              color: '#94a3b8',
                              fontSize: '12px'
                            }}>
                              {category.count} transactions
                            </p>
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                          <div style={{
                            fontSize: isMobile ? '16px' : '18px',
                            fontWeight: '700',
                            color: '#fff',
                            marginBottom: '4px'
                          }}>
                            {formatCurrency(category.total)}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            fontWeight: '600',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}>
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div style={{
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          style={{
                            height: '100%',
                            background: category.color || '#3b82f6',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: isMobile ? '18px' : '24px',
              padding: isMobile ? '24px' : '32px',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#fff'
              }}>
                💡
              </div>
              <h3 style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '700',
                margin: 0
              }}>
                Spending Insights
              </h3>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: isMobile ? '16px' : '20px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '14px',
                padding: isMobile ? '20px' : '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: isMobile ? '12px' : '16px'
                }}>
                  <FiCalendar size={20} color="#3b82f6" />
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: '600'
                    }}>
                      Peak Spending Day
                    </h4>
                    <p style={{
                      margin: 0,
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>
                      {analytics.dailyTrend?.reduce((max, day) => 
                        day.total > max.total ? day : max, 
                        { total: 0, date: new Date().toISOString() }
                      ).date ? new Date(
                        analytics.dailyTrend.reduce((max, day) => 
                          day.total > max.total ? day : max, 
                          { total: 0, date: new Date().toISOString() }
                        ).date
                      ).toLocaleDateString('en-US', { weekday: 'long' }) : 'Not enough data'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '14px',
                padding: isMobile ? '20px' : '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: isMobile ? '12px' : '16px'
                }}>
                  <FiTarget size={20} color="#10b981" />
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: '600'
                    }}>
                      Budget Progress
                    </h4>
                    <p style={{
                      margin: 0,
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>
                      {((analytics.summary?.totalSpent || 0) / 1000 * 100).toFixed(1)}% of monthly budget
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          
          .insights-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;