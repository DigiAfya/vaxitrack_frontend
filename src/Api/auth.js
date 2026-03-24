import { api } from './api';
export const registerUser = (payload) => api.post('/api/v1/auth/register', payload);
export const loginUser = (data) => {
  return api.post("/api/v1/auth/login", data);
};