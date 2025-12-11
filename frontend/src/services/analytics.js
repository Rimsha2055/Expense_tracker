import API from './api';

export const analyticsService = {
  getSpendingAnalytics: async (period = 'month', startDate, endDate) => {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const queryParams = new URLSearchParams(params).toString();
    const response = await API.get(`/analytics/spending?${queryParams}`);
    return response.data;
  },

  getCategoryAnalytics: async () => {
    const response = await API.get('/analytics/categories');
    return response.data;
  }
,

  getUserBalance: async () => {
    const response = await API.get('/user/balance');
    return response.data;
  },

  getUserExpensesCount: async () => {
    const response = await API.get('/user/expenses/count');
    return response.data;
  },

  getUserGroupsCount: async () => {
    const response = await API.get('/user/groups/count');
    return response.data;
  }
};