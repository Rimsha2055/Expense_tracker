import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiShield, 
  FiSmartphone,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';
import { 
  FaTwitter, 
  FaLinkedinIn, 
  FaGithub, 
  FaDribbble,
  FaChartLine,
  FaDatabase,
  FaLock
} from 'react-icons/fa';
import { SiMaterialdesignicons } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: isMobile ? '40px 20px 20px' : '60px 20px 30px',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)',
      }} />
      
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '50px',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Main Footer Content - Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
              }}>
                <FaChartLine />
              </div>
              <div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#fff',
                  margin: 0,
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a5b4fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  BudgetBuddy
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '500',
                  letterSpacing: '1px',
                  margin: '4px 0 0 0'
                }}>
                  
                </p>
              </div>
            </div>
            <p style={{
              color: '#cbd5e1',
              fontSize: '15px',
              lineHeight: '1.6',
              marginBottom: '25px'
            }}>
              Advanced financial analytics and expense management platform for modern businesses and professionals.
            </p>
            
            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiMail style={{ color: '#60a5fa', fontSize: '16px' }} />
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>support@finflowpro.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiPhone style={{ color: '#60a5fa', fontSize: '16px' }} />
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>+1 (555) 123-4567</span>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FiTrendingUp style={{ color: '#60a5fa' }} />
              Key Features
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { icon: <FiBarChart2 />, text: 'Advanced Analytics', desc: 'Real-time insights' },
                { icon: <FaDatabase />, text: 'Data Integration', desc: 'Multi-platform sync' },
                { icon: <FaLock />, text: 'Bank-Level Security', desc: '256-bit encryption' },
                { icon: <FiSmartphone />, text: 'Mobile App', desc: 'iOS & Android' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                    fontSize: '16px'
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <p style={{ color: '#fff', margin: 0, fontSize: '14px', fontWeight: '500' }}>
                      {feature.text}
                    </p>
                    <p style={{ color: '#94a3b8', margin: '2px 0 0 0', fontSize: '12px' }}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FiShield style={{ color: '#60a5fa' }} />
              Resources
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                'Documentation', 'API Reference', 'Case Studies', 'Pricing',
                'Blog', 'Help Center', 'Community', 'Status'
              ].map((link) => (
                <motion.a
                  key={link}
                  whileHover={{ x: 5, color: '#60a5fa' }}
                  href="#"
                  style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '400',
                    padding: '8px 0',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    borderRadius: '50%',
                    opacity: 0.7
                  }} />
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <SiMaterialdesignicons style={{ color: '#60a5fa' }} />
              Stay Updated
            </h4>
            <p style={{
              color: '#cbd5e1',
              fontSize: '14px',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  padding: '15px 20px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  border: 'none',
                  padding: '15px 25px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>

        </div>

        {/* Bottom Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px'
        }}>

          {/* Social Media */}
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { icon: <FaTwitter />, label: 'Twitter', gradient: 'linear-gradient(135deg, #1DA1F2, #0d8dc8)' },
              { icon: <FaLinkedinIn />, label: 'LinkedIn', gradient: 'linear-gradient(135deg, #0077B5, #005582)' },
              { icon: <FaGithub />, label: 'GitHub', gradient: 'linear-gradient(135deg, #333, #000)' },
              { icon: <FaDribbble />, label: 'Dribbble', gradient: 'linear-gradient(135deg, #EA4C89, #c32361)' }
            ].map((social) => (
              <motion.a
                key={social.label}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                style={{
                  width: '44px',
                  height: '44px',
                  background: social.gradient,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s'
                }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright & Legal */}
          <div style={{
            textAlign: 'center',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '25px',
              marginBottom: '15px'
            }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Compliance'].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: '400',
                    transition: 'all 0.3s'
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
            <p style={{
              color: '#64748b',
              fontSize: '13px',
              margin: 0
            }}>
              © {currentYear} BudgetBuddy. All rights reserved.
            </p>
            <p style={{
              color: '#64748b',
              fontSize: '11px',
              margin: '8px 0 0 0',
              letterSpacing: '0.5px'
            }}>
              Enterprise-grade financial management platform • SOC 2 Type II Certified
            </p>
          </div>

        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;