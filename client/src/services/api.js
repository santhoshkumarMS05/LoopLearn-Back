// services/api.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API call failed');
  }

  return data;
};

// Auth Service
export const authService = {
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  signup: (userData) => apiCall('/auth/signup', 'POST', userData),
  getMe: () => apiCall('/auth/me')
};

// User Service
export const userService = {
  getProfile: () => apiCall('/users/profile'),
  updateProfile: (data) => apiCall('/users/profile', 'PUT', data),
  updatePreferences: (preferences) => apiCall('/users/preferences', 'PUT', preferences),
  getStats: () => apiCall('/users/stats'),
  resetProgress: () => apiCall('/users/reset-progress', 'DELETE'),
  deleteAccount: () => apiCall('/users/account', 'DELETE')
};

// Skill Service
export const skillService = {
  getAllSkills: () => apiCall('/skills'),
  getSkillNames: () => apiCall('/skills/names'),
  logPractice: (data) => apiCall('/skills/log', 'POST', data),
  updateLog: (id, data) => apiCall(`/skills/log/${id}`, 'PUT', data),
  deleteLog: (id) => apiCall(`/skills/log/${id}`, 'DELETE'),
  getPracticeHistory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/skills/history${queryString ? `?${queryString}` : ''}`);
  },
  getTodayStats: () => apiCall('/skills/today-stats')
};

// Review Service
export const reviewService = {
  getWeakSkills: () => apiCall('/review/weak-skills'),
  generatePlan: () => apiCall('/review/generate-plan'),
  getChartData: () => apiCall('/review/chart-data')
};

// AI Service
export const aiService = {
  chat: (message, context) => apiCall('/ai/chat', 'POST', { message, context })
};

export default {
  auth: authService,
  user: userService,
  skills: skillService,
  review: reviewService,
  ai: aiService
};