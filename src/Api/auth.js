import { api } from './api';

export const registerUser = (payload) => api.post('/api/auth/register', payload);

export const loginUser = (data) => {
  return api.post("/api/auth/login", data);
};