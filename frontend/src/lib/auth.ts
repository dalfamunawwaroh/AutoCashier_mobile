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

export const registerUser = async (username: string, email: string, phone: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, phone, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Terjadi kesalahan saat register.');
  }
};

export const updateUserProfile = async (id: string, name: string, username: string, avatar: string, email?: string) => {
  try {
    const response = await axios.put(`${API_URL}/auth/user/${id}`, { name, username, avatar, email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Terjadi kesalahan saat memperbarui profil.');
  }
};

export const resetPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Gagal mengirim email reset.');
  }
};

export const confirmResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Gagal mereset password.');
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Gagal memverifikasi OTP.');
  }
};
