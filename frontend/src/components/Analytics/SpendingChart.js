import React, { useState } from 'react';
import { formatCurrency } from '../../utils/currency';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiCalendar,
  FiBarChart2,
  FiMaximize2,
  FiFilter
} from 'react-icons/fi';
import { FaRegChartBar } from 'react-icons/fa';

const SpendingChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [expanded, setExpanded] = useState(false);

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '20px',
          padding: '40px 20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{
          width: '70px',
          height: '70px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: '#94a3b8'
        }}>
          <FaRegChartBar />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ 
            color: '#fff', 
            margin: '0 0 8px 0', 
            fontSize: '16px',
            fontWeight: '600'
          }}>
            No Spending Data
          </h3>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '13px', 
            margin: 0,
            lineHeight: '1.5'
          }}>
            Add transactions to visualize your spending trends
          </p>
        </div>
      </motion.div>
    );
  }

  // Calculate statistics
  const maxValue = Math.max(...data.map(d => d.total));
  const totalSpent = data.reduce((sum, day) => sum + day.total, 0);
  const avgDaily = totalSpent / data.length;
  const totalTransactions = data.reduce((sum, day) => sum + day.count, 0);
  
  // Calculate trend
  const halfIndex = Math.floor(data.length / 2);
  const firstHalfTotal = data.slice(0, halfIndex).reduce((sum, day) => sum + day.total, 0);
  const secondHalfTotal = data.slice(halfIndex).reduce((sum, day) => sum + day.total, 0);
  const trendPercentage = firstHalfTotal > 0 ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100 : 0;
  
  // Chart dimensions - Responsive
  const chartHeight = expanded ? 280 : 220;
  const barWidth = expanded ? 50 : 40;
  const spacing = expanded ? 30 : 20;
  const totalWidth = data.length * (barWidth + spacing) + spacing;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              flexShrink: 0
            }}>
              <FiTrendingUp />
            </div>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#fff',
                margin: 0,
                lineHeight: '1.3'
              }}>
                Spending Trends
              </h2>
              <p style={{
                color: '#94a3b8',
                fontSize: '13px',
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Daily expense visualization
              </p>
            </div>
          </div>

          {/* Stats and Controls */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {/* Time Range Selector */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0
            }}>
              {['week', 'month', 'quarter'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '6px 14px',
                    background: timeRange === range 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' 
                      : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: timeRange === range ? '#fff' : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                    minWidth: '60px'
                  }}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Expand Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s',
                flexShrink: 0
              }}
            >
              <FiMaximize2 style={{ 
                transform: expanded ? 'rotate(45deg)' : 'rotate(0)',
                transition: 'transform 0.3s'
              }} />
            </motion.button>
          </div>
        </div>

        {/* Stats Summary - Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          width: '100%'
        }}>
          {[
            {
              label: 'Total Spent',
              value: formatCurrency(totalSpent),
              color: '#3b82f6',
              icon: <FiBarChart2 />
            },
            {
              label: 'Daily Avg',
              value: formatCurrency(avgDaily),
              color: '#10b981',
              icon: <FiTrendingUp />
            },
            {
              label: 'Peak Day',
              value: formatCurrency(maxValue),
              color: '#f59e0b',
              icon: <FiTrendingUp />
            },
            {
              label: 'Trend',
              value: `${trendPercentage >= 0 ? '+' : ''}${trendPercentage.toFixed(1)}%`,
              color: trendPercentage >= 0 ? '#10b981' : '#ef4444',
              icon: trendPercentage >= 0 ? <FiTrendingUp /> : <FiTrendingDown />
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '72px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '100%'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.15)`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {stat.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    marginBottom: '4px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {stat.value}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div style={{
        position: 'relative',
        height: `${chartHeight + 50}px`,
        paddingLeft: '50px',
        paddingRight: '16px',
        paddingBottom: '32px',
        marginBottom: '16px',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* Grid lines and Y-axis */}
        {gridLines.map((ratio, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50px',
              right: '16px',
              top: `${chartHeight * (1 - ratio) + 10}px`,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              zIndex: 0
            }}
          >
            <span style={{
              position: 'absolute',
              left: '-45px',
              top: '-8px',
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '500',
              minWidth: '40px',
              textAlign: 'right'
            }}>
              {formatCurrency(maxValue * ratio)}
            </span>
          </div>
        ))}

        {/* Chart Area */}
        <div style={{
          width: `${totalWidth}px`,
          height: '100%',
          position: 'relative',
          minWidth: '100%'
        }}>
          {/* Bars */}
          {data.map((day, index) => {
            const height = (day.total / maxValue) * chartHeight;
            const isToday = index === data.length - 1;
            
            return (
              <motion.div
                key={index}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: height, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{
                  position: 'absolute',
                  bottom: '32px',
                  left: `${index * (barWidth + spacing) + spacing}px`,
                  width: `${barWidth}px`,
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  zIndex: hoveredBar === index ? 3 : 1,
                  background: isToday 
                    ? 'linear-gradient(to top, #3b82f6, #6366f1)' 
                    : hoveredBar === index
                    ? 'linear-gradient(to top, #60a5fa, #a5b4fc)'
                    : 'linear-gradient(to top, rgba(59, 130, 246, 0.7), rgba(99, 102, 241, 0.7))',
                  boxShadow: hoveredBar === index 
                    ? `0 8px 24px rgba(96, 165, 250, 0.3)`
                    : isToday
                    ? '0 4px 16px rgba(59, 130, 246, 0.25)'
                    : '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transform: hoveredBar === index ? 'scale(1.05, 1.02)' : 'scale(1)',
                  transformOrigin: 'bottom',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Date Label */}
                <div style={{
                  position: 'absolute',
                  bottom: '-26px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  color: isToday ? '#60a5fa' : hoveredBar === index ? '#fff' : '#94a3b8',
                  fontWeight: isToday ? '600' : '400',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    day: 'numeric' 
                  })}
                </div>

                {/* Amount Label */}
                <div style={{
                  position: 'absolute',
                  top: '-36px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  color: '#fff',
                  fontWeight: '600',
                  opacity: hoveredBar === index ? 1 : 0,
                  transition: 'opacity 0.2s',
                  background: 'rgba(30, 41, 59, 0.95)',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  whiteSpace: 'nowrap',
                  zIndex: 4,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {formatCurrency(day.total)}
                </div>
              </motion.div>
            );
          })}

          {/* Hover Line */}
          {hoveredBar !== null && (
            <div style={{
              position: 'absolute',
              top: '0',
              bottom: '32px',
              left: `${hoveredBar * (barWidth + spacing) + spacing + barWidth / 2}px`,
              width: '1px',
              background: 'rgba(255, 255, 255, 0.15)',
              zIndex: 2
            }} />
          )}

          {/* X-axis line */}
          <div style={{
            position: 'absolute',
            bottom: '32px',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)'
          }} />
        </div>

        {/* Y-axis label */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          color: '#94a3b8',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          opacity: 0.7,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          AMOUNT
        </div>
      </div>

      {/* Legend and Additional Info */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                background: 'linear-gradient(to top, #3b82f6, #6366f1)',
                borderRadius: '2px'
              }} />
              <span style={{ 
                fontSize: '11px', 
                color: '#94a3b8',
                fontWeight: '400'
              }}>
                Daily
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                background: '#60a5fa',
                borderRadius: '2px'
              }} />
              <span style={{ 
                fontSize: '11px', 
                color: '#94a3b8',
                fontWeight: '400'
              }}>
                Hovered
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                background: '#f59e0b',
                borderRadius: '2px'
              }} />
              <span style={{ 
                fontSize: '11px', 
                color: '#94a3b8',
                fontWeight: '400'
              }}>
                Today
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flexShrink: 0
          }}>
            <FiCalendar style={{ 
              color: '#94a3b8', 
              fontSize: '12px',
              opacity: 0.7
            }} />
            <span style={{ 
              fontSize: '11px', 
              color: '#94a3b8',
              fontWeight: '400'
            }}>
              {data.length} days • {totalTransactions} trans
            </span>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style>{`
        @media (max-width: 768px) {
          .chart-container {
            padding: 20px 16px;
            border-radius: 16px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .chart-header-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .chart-controls-container {
            width: 100%;
            justify-content: space-between;
          }
          
          .time-range-selector {
            flex: 1;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .chart-container {
            padding: 16px 12px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          .stat-card {
            padding: 14px 12px;
          }
          
          .stat-value {
            font-size: 15px;
          }
          
          .time-selector button {
            padding: 6px 10px;
            font-size: 11px;
            min-width: 50px;
          }
          
          .chart-title {
            font-size: 16px;
          }
          
          .chart-subtitle {
            font-size: 12px;
          }
        }
        
        /* Custom scrollbar for horizontal scrolling */
        .chart-scroll-area::-webkit-scrollbar {
          height: 4px;
        }
        
        .chart-scroll-area::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .chart-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }
        
        .chart-scroll-area::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        
        /* Ensure proper text rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Improve touch targets on mobile */
        @media (max-width: 768px) {
          button, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default SpendingChart;