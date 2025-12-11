import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currency';
import { motion } from 'framer-motion';
import { 
  FiPieChart, 
  FiTrendingUp, 
  FiDatabase, 
  FiBarChart2,
  FiInfo
} from 'react-icons/fi';
import { FaRegChartBar } from 'react-icons/fa';

const PieChart = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: '28vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '1.25rem',
          padding: '2rem 1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{
          width: '12vw',
          maxWidth: '80px',
          aspectRatio: '1 / 1',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.25rem',
          color: '#94a3b8'
        }}>
          <FiPieChart />
        </div>
        <div style={{ textAlign: 'center', padding: '0 1rem' }}>
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>
            No Data Available
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            Add transactions to see your spending breakdown
          </p>
        </div>
      </motion.div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);
  // If all totals are zero (or invalid), show empty state to avoid invalid SVG paths
  if (!total || Number.isNaN(total) || total === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '24vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '1rem', borderRadius: '12px', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>No Spending Data</div>
          <div style={{ color: '#94a3b8' }}>Transactions have zero amounts — add data to visualize the chart.</div>
        </div>
      </motion.div>
    );
  }
  const size = 220;
  const radius = 85;
  const center = size / 2;
  const totalTransactions = data.reduce((sum, item) => sum + item.count, 0);
  
  // Generate professional color palette
  const getColorPalette = (index) => {
    const palette = [
      { primary: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' },
      { primary: '#6366f1', light: 'rgba(99, 102, 241, 0.1)' },
      { primary: '#8b5cf6', light: 'rgba(139, 92, 246, 0.1)' },
      { primary: '#10b981', light: 'rgba(16, 185, 129, 0.1)' },
      { primary: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
      { primary: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
      { primary: '#06b6d4', light: 'rgba(6, 182, 212, 0.1)' },
      { primary: '#8b5cf6', light: 'rgba(139, 92, 246, 0.1)' }
    ];
    return palette[index % palette.length];
  };

  // Generate slices
  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.total / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = startAngle + angle;
    currentAngle = endAngle;

    // Calculate coordinates for the slice
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    const colors = getColorPalette(index);
    
    return {
      id: index,
      data: item,
      percentage,
      path: `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      startAngle,
      endAngle,
      color: colors.primary,
      lightColor: colors.light
    };
  });

  // Get largest and smallest categories
  const sortedByAmount = [...data].sort((a, b) => b.total - a.total);
  const largestCategory = sortedByAmount[0];
  const smallestCategory = sortedByAmount[sortedByAmount.length - 1];

  const isTablet = screenWidth <= 1024;
  const isMobile = screenWidth <= 768;
  const isSmallMobile = screenWidth <= 480;

  const containerStyle = {
    padding: isMobile ? '1rem' : '1.5rem',
    boxSizing: 'border-box',
  };

  const mainContentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px',
    position: 'relative',
    zIndex: 1
  };

  const chartStatsStyle = {
    gridTemplateColumns: isSmallMobile ? '1fr' : 'repeat(2, 1fr)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
        ...containerStyle,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
        position: 'relative',
        zIndex: 1
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '20px'
            }}>
              <FiPieChart />
            </div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#fff',
              margin: 0
            }}>
              Spending Analysis
            </h2>
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '14px',
            margin: 0
          }}>
            Visual breakdown of your expenses by category
          </p>
        </div>

        {/* Stats Badge */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '10px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
            Total Spent
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#fff',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {formatCurrency(total)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Left Column - Chart */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '25px'
        }}>
          <div style={{ position: 'relative', width: '100%', paddingTop: '100%', maxWidth: '100%' }}>
            {/* SVG Pie Chart - responsive via viewBox and absolute fill */}
            <svg viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              {slices.map((slice, index) => (
                <motion.path
                  key={slice.id}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  d={slice.path}
                  fill={slice.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                  style={{
                    filter: hoveredSlice === index 
                      ? `drop-shadow(0 8px 16px ${slice.color}40)` 
                      : 'none',
                    transform: hoveredSlice === index ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: 'center',
                    cursor: 'pointer',
                    opacity: hoveredSlice === null || hoveredSlice === index ? 1 : 0.7
                  }}
                  onMouseEnter={() => setHoveredSlice(index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              ))}
              
              {/* Center circle */}
              <circle cx={center} cy={center} r={radius * 0.3} fill="#1e293b" />
              
              {/* Center text */}
              <text
                x={center}
                y={center - 8}
                textAnchor="middle"
                fontSize="16"
                fontWeight="600"
                fill="#fff"
              >
                {data.length} Categories
              </text>
              <text
                x={center}
                y={center + 12}
                textAnchor="middle"
                fontSize="12"
                fill="#94a3b8"
              >
                {totalTransactions} Transactions
              </text>
            </svg>

            {/* Hover tooltip */}
            {hoveredSlice !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(30, 41, 59, 0.95)',
                  backdropFilter: 'blur(20px)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  boxShadow: '0 1.25rem 3.75rem rgba(0, 0, 0, 0.4)',
                  zIndex: 10,
                  maxWidth: '90%',
                  width: 'auto',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: slices[hoveredSlice].color,
                    borderRadius: '4px'
                  }} />
                  <h4 style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    {slices[hoveredSlice].data.categoryName}
                  </h4>
                </div>
                
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: slices[hoveredSlice].color,
                  marginBottom: '0.5rem',
                  background: `linear-gradient(135deg, ${slices[hoveredSlice].color} 0%, #a5b4fc 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {formatCurrency(slices[hoveredSlice].data.total)}
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <FiTrendingUp />
                  {slices[hoveredSlice].percentage.toFixed(1)}% of total
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#cbd5e1'
                }}>
                  <span>{slices[hoveredSlice].data.count} transactions</span>
                  <span>Avg: {formatCurrency(slices[hoveredSlice].data.total / slices[hoveredSlice].data.count)}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmallMobile ? '1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
            gap: '12px',
            width: '100%'
          }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                Categories
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#3b82f6'
              }}>
                {data.length}
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                Transactions
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#10b981'
              }}>
                {totalTransactions}
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                Average
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#f59e0b'
              }}>
                {formatCurrency(total / data.length)}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Legend & Details */}
        <div>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '25px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {['overview', 'details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: activeTab === tab 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: activeTab === tab ? '#fff' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {tab === 'overview' ? <FiBarChart2 /> : <FiDatabase />}
                {tab}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            maxHeight: '40vh',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {slices.map((slice, index) => (
              <motion.div
                key={slice.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{
                  padding: '16px',
                  background: hoveredSlice === index 
                    ? slices[index].lightColor 
                    : 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: `1px solid ${hoveredSlice === index ? slice.color : 'transparent'}`,
                  marginBottom: '10px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background glow on hover */}
                {hoveredSlice === index && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at center, ${slice.color}10 0%, transparent 70%)`,
                    zIndex: 0
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: slice.color,
                    borderRadius: '4px',
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${slice.color}40`
                  }} />
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#fff',
                      marginBottom: '4px'
                    }}>
                      {slice.data.categoryName}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FiInfo size={10} />
                      {slice.data.count} transactions
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: slice.color,
                    marginBottom: '4px'
                  }}>
                    {formatCurrency(slice.data.total)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontWeight: '600',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {slice.percentage.toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: '25px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h4 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#fff',
              margin: '0 0 15px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FiTrendingUp />
              Spending Insights
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Largest Category</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                  {largestCategory?.categoryName} ({((largestCategory?.total / total) * 100).toFixed(1)}%)
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Smallest Category</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                  {smallestCategory?.categoryName} ({((smallestCategory?.total / total) * 100).toFixed(1)}%)
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Average per Transaction</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                  {formatCurrency(total / totalTransactions)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </motion.div>
  );
};

export default PieChart;