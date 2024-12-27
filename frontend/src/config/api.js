const API_BASE_URL = 'http://localhost:5003/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  
  // Transaction endpoints
  SEND_MONEY: `${API_BASE_URL}/transactions/send-money`,
  ADD_MONEY: `${API_BASE_URL}/transactions/add-money`,
  GET_USER: (upiId) => `${API_BASE_URL}/transactions/user/${upiId}`,
  TRANSACTION_HISTORY: `${API_BASE_URL}/transactions/history`,
  
  // Test endpoint
  TEST: `${API_BASE_URL}/transactions/test`
};

export default API_ENDPOINTS;
