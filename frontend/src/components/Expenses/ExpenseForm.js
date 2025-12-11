import React, { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenses';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiTag, 
  FiCalendar, 
  FiCreditCard, 
  FiFileText,
  FiUpload,
  FiX,
  FiCheck,
  FiRefreshCw,
  FiUsers,
  FiLink
} from 'react-icons/fi';
import { 
  FaMoneyBillWave,
  FaRegCreditCard,
  FaBuilding,
  FaMobileAlt,
  FaWallet
} from 'react-icons/fa';

const ExpenseForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    categoryId: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    isShared: false,
    isRecurring: false,
    recurrenceInterval: '',
    receiptUrl: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
        expenseDate: initialData.expenseDate || new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'cash',
        isShared: initialData.isShared || false,
        isRecurring: initialData.isRecurring || false,
        recurrenceInterval: initialData.recurrenceInterval || '',
        receiptUrl: initialData.receiptUrl || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchCategories();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await expenseService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only keep Cash as a payment method per user request
  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: <FaMoneyBillWave />, color: '#10b981' }
  ];

  const recurrenceOptions = [
    { value: '', label: 'None', icon: <FiX /> },
    { value: 'daily', label: 'Daily', icon: <FiCalendar /> },
    { value: 'weekly', label: 'Weekly', icon: <FiCalendar /> },
    { value: 'monthly', label: 'Monthly', icon: <FiCalendar /> },
    { value: 'yearly', label: 'Yearly', icon: <FiCalendar /> }
  ];

  const formGridStyle = {
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '16px' : '20px',
  };

  const paymentMethodsGridStyle = {
    gridTemplateColumns: isSmallMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
  };

  const checkboxGridStyle = {
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '16px' : '20px',
  };

  const recurrenceGridStyle = {
    gridTemplateColumns: isSmallMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(120px, 1fr))',
  };

  const actionButtonsStyle = {
    flexDirection: isSmallMobile ? 'column' : 'row',
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title and Amount */}
      <div style={{
        display: 'grid',
        ...formGridStyle,
        marginBottom: '25px'
      }}>
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            color: '#cbd5e1',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <FiFileText size={14} />
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              fontSize: '15px',
              color: '#fff',
              transition: 'all 0.3s'
            }}
            placeholder="What did you spend on?"
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.background = 'rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            color: '#cbd5e1',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <FiDollarSign size={14} />
            Amount (PKR) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              fontSize: '15px',
              color: '#fff',
              transition: 'all 0.3s'
            }}
            placeholder="0.00"
            onFocus={(e) => {
              e.target.style.borderColor = '#10b981';
              e.target.style.background = 'rgba(16, 185, 129, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>
      </div>

      {/* Category and Date */}
      <div style={{
        display: 'grid',
        ...formGridStyle,
        marginBottom: '25px'
      }}>
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            color: '#cbd5e1',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <FiTag size={14} />
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              fontSize: '15px',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#8b5cf6';
              e.target.style.background = 'rgba(139, 92, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <option value="" style={{ background: '#1e293b', color: '#94a3b8' }}>Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id} style={{ background: '#1e293b', color: '#fff' }}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            color: '#cbd5e1',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <FiCalendar size={14} />
            Date
          </label>
          <input
            type="date"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              fontSize: '15px',
              color: '#fff',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
              e.target.style.background = 'rgba(245, 158, 11, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          color: '#cbd5e1',
          fontSize: '13px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <FiCreditCard size={14} />
          Payment Method
        </label>
        <div style={{
          display: 'grid',
          ...paymentMethodsGridStyle,
          gap: '12px'
        }}>
          {paymentMethods.map(method => (
            <motion.div
              key={method.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value }))}
              style={{
                padding: '16px',
                background: formData.paymentMethod === method.value 
                  ? `${method.color}20` 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  formData.paymentMethod === method.value 
                    ? method.color 
                    : 'rgba(255, 255, 255, 0.1)'
                }`,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '20px',
                marginBottom: '10px',
                color: method.color,
                display: 'flex',
                justifyContent: 'center'
              }}>
                {method.icon}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: formData.paymentMethod === method.value ? '#fff' : '#94a3b8'
              }}>
                {method.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          color: '#cbd5e1',
          fontSize: '13px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <FiFileText size={14} />
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            fontSize: '15px',
            color: '#fff',
            resize: 'vertical',
            transition: 'all 0.3s'
          }}
          placeholder="Add any additional details..."
          onFocus={(e) => {
            e.target.style.borderColor = '#0ea5e9';
            e.target.style.background = 'rgba(14, 165, 233, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        />
      </div>


      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'flex-end',
        ...actionButtonsStyle
      }}>
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '14px 28px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#94a3b8',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            e.target.style.color = '#ef4444';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            e.target.style.color = '#94a3b8';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <FiX size={16} />
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              {initialData ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>
              <FiUpload size={16} />
              {initialData ? 'Update Expense' : 'Add Expense'}
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default ExpenseForm;