import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getOne: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  delete: (id) => api.delete(`/properties/${id}`),
};

export const agentAPI = {
  chat: (message, sessionId) => api.post('/agent/chat', { message, sessionId }),
  clearHistory: (sessionId) => api.delete(`/agent/history/${sessionId}`),
};

export default api;
