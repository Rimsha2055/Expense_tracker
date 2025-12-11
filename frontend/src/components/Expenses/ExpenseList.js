import React, { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../../services/expenses';
import ExpenseItem from './ExpenseItem';
import ExpenseForm from './ExpenseForm';
import ExpenseFilters from './ExpenseFilters';
import Modal from '../Common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiFilter, 
  FiTrendingUp, 
  FiFileText,
  FiCreditCard,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
 
} from 'react-icons/fi';
import { FaChartBar, FaMoneyBillWave, FaReceipt } from 'react-icons/fa';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    categoryId: '',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const fetchExpenses = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await expenseService.getAllExpenses({
        ...filters,
        page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setExpenses(response.data.expenses);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleCreateExpense = async (expenseData) => {
    try {
      const response = await expenseService.createExpense(expenseData);
      if (response.success) {
        toast.success('Expense added successfully!');
        setShowForm(false);
        fetchExpenses();
      }
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const response = await expenseService.updateExpense(id, expenseData);
      if (response.success) {
        toast.success('Expense updated successfully!');
        setEditingExpense(null);
        fetchExpenses();
      }
    } catch (error) {
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await expenseService.deleteExpense(id);
        if (response.success) {
          toast.success('Expense deleted successfully!');
          fetchExpenses();
        }
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      categoryId: '',
      startDate: '',
      endDate: '',
      search: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

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

  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      width: '100%', 
      padding: isMobile ? '16px' : '0 24px' 
    }}>
      {/* Header with Stats */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: isMobile ? '18px' : '24px',
        padding: isMobile ? '24px 20px' : '32px 30px',
        marginBottom: isMobile ? '20px' : '30px',
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
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                color: '#fff'
              }}>
                <FaReceipt />
              </div>
              <div>
                <h2 style={{
                  fontSize: isMobile ? '22px' : isTablet ? '26px' : '28px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2',
                  color: '#fff'
                }}>
                  Expense Management
                </h2>
                <p style={{
                  fontSize: isMobile ? '14px' : '15px',
                  color: '#94a3b8',
                  margin: 0
                }}>
                  Track and manage all your expenses
                </p>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: '#fff',
              border: 'none',
              padding: isMobile ? '14px 20px' : '16px 32px',
              borderRadius: '12px',
              fontSize: isMobile ? '14px' : '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '12px',
              transition: 'all 0.3s',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <FiPlus size={isMobile ? 18 : 20} />
            {isMobile ? 'Add Expense' : 'Add New Expense'}
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <ExpenseFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
      />

      {/* Content */}
      <div style={{ marginTop: '30px' }}>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 20px',
              gap: '24px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                color: '#fff', 
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Loading Expenses
              </p>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '14px',
                margin: 0
              }}>
                Fetching your financial data...
              </p>
            </div>
          </motion.div>
        ) : expenses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              opacity: 0.3,
              color: '#94a3b8'
            }}>
              <FaMoneyBillWave />
            </div>
            <h3 style={{
              fontSize: '22px',
              color: '#fff',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              No Expenses Found
            </h3>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '15px',
              marginBottom: '30px',
              maxWidth: '400px',
              margin: '0 auto 30px'
            }}>
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters or add a new expense'
                : 'Start by adding your first expense!'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
              }}
            >
              <FiPlus size={20} />
              Add Your First Expense
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Summary Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: isMobile ? '16px' : '20px',
              marginBottom: isMobile ? '24px' : '32px'
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  padding: isMobile ? '20px' : '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <FiFileText size={20} color="#3b82f6" />
                  <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#94a3b8',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total Expenses
                  </div>
                </div>
                <div style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  {pagination.total}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  padding: isMobile ? '20px' : '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  
                  <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#94a3b8',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total Amount
                  </div>
                </div>
                <div style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  Rs{totalAmount.toFixed(2)}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  padding: isMobile ? '20px' : '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <FaChartBar size={20} color="#f59e0b" />
                  <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#94a3b8',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Average
                  </div>
                </div>
                <div style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  Rs{averageAmount.toFixed(2)}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  padding: isMobile ? '20px' : '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <FiCreditCard size={20} color="#8b5cf6" />
                  <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#94a3b8',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Page
                  </div>
                </div>
                <div style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  {pagination.page}/{pagination.pages}
                </div>
              </motion.div>
            </div>

            {/* Expense List */}
            <AnimatePresence>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {expenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ExpenseItem
                      expense={expense}
                      onEdit={() => setEditingExpense(expense)}
                      onDelete={() => handleDeleteExpense(expense.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '40px',
                  flexWrap: 'wrap'
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchExpenses(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  style={{
                    padding: isMobile ? '12px 16px' : '14px 24px',
                    background: pagination.page === 1 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    color: pagination.page === 1 ? '#64748b' : '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '600',
                    opacity: pagination.page === 1 ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <FiChevronLeft size={isMobile ? 16 : 18} />
                  {isMobile ? '' : 'Previous'}
                </motion.button>
                
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => fetchExpenses(pageNum)}
                        style={{
                          width: isMobile ? '40px' : '48px',
                          height: isMobile ? '40px' : '48px',
                          background: pagination.page === pageNum 
                            ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          color: pagination.page === pageNum ? '#fff' : '#cbd5e1',
                          border: `1px solid ${
                            pagination.page === pageNum 
                              ? '#3b82f6' 
                              : 'rgba(255, 255, 255, 0.1)'
                          }`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: isMobile ? '14px' : '16px',
                          fontWeight: '600',
                          transition: 'all 0.3s',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          if (pagination.page !== pageNum) {
                            e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                            e.target.style.color = '#3b82f6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pagination.page !== pageNum) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.color = '#cbd5e1';
                          }
                        }}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                  
                  {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                    <>
                      <span style={{ color: '#64748b', fontSize: '20px' }}>...</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => fetchExpenses(pagination.pages)}
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '600',
                          transition: 'all 0.3s',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                          e.target.style.color = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.target.style.color = '#cbd5e1';
                        }}
                      >
                        {pagination.pages}
                      </motion.button>
                    </>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchExpenses(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  style={{
                    padding: isMobile ? '12px 16px' : '14px 24px',
                    background: pagination.page === pagination.pages 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    color: pagination.page === pagination.pages ? '#64748b' : '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '600',
                    opacity: pagination.page === pagination.pages ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {isMobile ? '' : 'Next'}
                  <FiChevronRight size={isMobile ? 16 : 18} />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Expense Form Modal */}
      <Modal
        isOpen={showForm || editingExpense}
        onClose={() => {
          setShowForm(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
        size="md"
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={editingExpense 
            ? (data) => handleUpdateExpense(editingExpense.id, data)
            : handleCreateExpense
          }
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      </Modal>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExpenseList;