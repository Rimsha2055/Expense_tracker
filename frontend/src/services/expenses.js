import API from './api';

export const expenseService = {
  // Get all expenses with filters
  getAllExpenses: async (params = {}) => {
    // Remove empty, null or undefined params so backend validators don't receive empty strings
    const cleanParams = Object.entries(params).reduce((acc, [k, v]) => {
      if (v === null || v === undefined) return acc;
      // treat empty strings and arrays with no values as absent
      if (typeof v === 'string' && v.trim() === '') return acc;
      if (Array.isArray(v) && v.length === 0) return acc;
      acc[k] = v;
      return acc;
    }, {});

    const queryParams = new URLSearchParams(cleanParams).toString();
    const response = await API.get(`/expenses${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Get single expense
  getExpense: async (id) => {
    const response = await API.get(`/expenses/${id}`);
    return response.data;
  },

  // Create new expense
  createExpense: async (expenseData) => {
    const response = await API.post('/expenses', expenseData);
    return response.data;
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await API.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await API.delete(`/expenses/${id}`);
    return response.data;
  },

  // Get expense statistics
  getExpenseStats: async () => {
    const response = await API.get('/expenses/stats/overview');
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await API.get('/analytics/categories');
    return response.data;
  }
};