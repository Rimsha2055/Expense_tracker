import API from './api';

export const friendService = {
  getFriends: async () => {
    const response = await API.get('/friends');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await API.get('/user/all');
    return response.data;
  },

  inviteByEmail: async (email) => {
    const response = await API.post('/friends/invite', { email });
    return response.data;
  },

  createInviteLink: async () => {
    const response = await API.post('/friends/create-invite');
    return response.data;
  },

  createInviteCode: async () => {
    const response = await API.post('/friends/create-code');
    return response.data;
  },

  acceptInvite: async (token) => {
    const response = await API.get(`/friends/accept-invite?token=${encodeURIComponent(token)}`);
    return response.data;
  },

  acceptInviteCode: async (code) => {
    const response = await API.post('/friends/accept-code', { code });
    return response.data;
  },

  sendFriendRequest: async (friendId) => {
    const response = await API.post('/friends', { friendId });
    return response.data;
  },

  getFriendRequests: async () => {
    const response = await API.get('/friends/requests');
    return response.data;
  },

  respondToFriendRequest: async (requestId, status) => {
    const response = await API.put(`/friends/requests/${requestId}/respond`, { status });
    return response.data;
  },

  removeFriend: async (friendId) => {
    const response = await API.delete(`/friends/${friendId}`);
    return response.data;
  }
};