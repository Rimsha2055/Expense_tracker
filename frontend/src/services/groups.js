import API from './api';

export const groupService = {
  getGroups: async () => {
    const response = await API.get('/groups');
    return response.data;
  },

  getGroup: async (id) => {
    const response = await API.get(`/groups/${id}`);
    return response.data;
  },

  createGroup: async (groupData) => {
    const response = await API.post('/groups', groupData);
    return response.data;
  },

  addMember: async (groupId, userId) => {
    const response = await API.post(`/groups/${groupId}/members`, { userId });
    return response.data;
  },

  removeMember: async (groupId, userId) => {
    const response = await API.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  createGroupExpense: async (groupId, expenseData) => {
    const response = await API.post(`/groups/${groupId}/expenses`, expenseData);
    return response.data;
  },

  getGroupBalances: async (groupId) => {
    const response = await API.get(`/groups/${groupId}/balances`);
    return response.data;
  },

  settleGroupPayment: async (groupId, data) => {
    const response = await API.post(`/groups/${groupId}/settle`, data);
    return response.data;
  },

  settleExpense: async (expenseId) => {
    const response = await API.post(`/expenses/${expenseId}/settle`);
    return response.data;
  }
,
  deleteGroup: async (groupId) => {
    const response = await API.delete(`/groups/${groupId}`);
    return response.data;
  }
};