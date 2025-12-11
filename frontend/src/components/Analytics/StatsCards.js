import React from 'react';
import { formatCurrency } from '../../utils/currency';
import { motion } from 'framer-motion';
import { FiCalendar, FiBarChart2, FiDollarSign, FiTag, FiTrendingUp } from 'react-icons/fi';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Weekly Total',
      value: formatCurrency(stats?.weeklyTotal || 0),
      change: '+12.5%',
      icon: <FiCalendar />,
      color: '#667eea',
      bgColor: 'rgba(102, 126, 234, 0.1)'
    },
    {
      title: 'Monthly Total',
      value: formatCurrency(stats?.monthlyTotal || 0),
      change: '+8.2%',
      icon: <FiBarChart2 />,
      color: '#764ba2',
      bgColor: 'rgba(118, 75, 162, 0.1)'
    },
    {
      title: 'Average Daily',
      value: formatCurrency((stats?.monthlyTotal || 0) / 30),
      change: '+5.3%',
      icon: <FiDollarSign />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Categories',
      value: stats?.categoryBreakdown?.length || 0,
      change: '',
      icon: <FiTag />,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: isMobile ? '16px' : '25px',
      marginBottom: isMobile ? '20px' : '40px'
    }}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          style={{
            background: '#fff',
            borderRadius: isMobile ? '16px' : '20px',
            padding: isMobile ? '20px' : '25px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${card.bgColor}`,
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '60px' : '80px',
            background: card.bgColor,
            borderRadius: '50%',
            opacity: 0.5
          }} />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: isMobile ? '16px' : '20px',
            flexWrap: 'wrap',
            gap: isMobile ? '12px' : '15px'
          }}>
            <div style={{
              width: isMobile ? '50px' : '60px',
              height: isMobile ? '50px' : '60px',
              background: card.bgColor,
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '20px' : '22px',
              color: card.color,
              flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                margin: '0 0 5px 0',
                color: '#666',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '500'
              }}>
                {card.title}
              </p>
              <h3 style={{
                margin: 0,
                fontSize: isMobile ? '22px' : isTablet ? '24px' : '28px',
                fontWeight: '700',
                color: card.color,
                lineHeight: '1.2',
                wordBreak: 'break-word'
              }}>
                {card.value}
              </h3>
            </div>
          </div>
          
          {card.change && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '5px 10px' : '6px 12px',
              background: card.bgColor,
              color: card.color,
              borderRadius: '20px',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '600'
            }}>
              <span>📈</span>
              {isMobile ? card.change : `${card.change} from last period`}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;