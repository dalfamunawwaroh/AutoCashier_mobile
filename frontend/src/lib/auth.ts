import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const loginUser = async (phone: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Terjadi kesalahan saat login.');
  }
};

export const registerUser = async (name: string, phone: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, phone, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Terjadi kesalahan saat register.');
  }
};

