// services/api.ts

import axios from 'axios';
import { 
  JournalistDashboard, 
  PublishedLink, 
  WithdrawalRequest, 
  AdminDashboard,
  PressReleaseStats
} from '../types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Configure axios instance with authentication
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Journalist Dashboard API
export const getJournalistDashboard = async (): Promise<JournalistDashboard> => {
  const response = await apiClient.get('journalist/dashboard/');
  return response.data;
};

// Published Links API
export const getPublishedLinks = async () => {
  const response = await apiClient.get('published-links/');
  return response.data;
};

export const createPublishedLink = async (data: Partial<PublishedLink>): Promise<PublishedLink> => {
  const response = await apiClient.post('/published-links/', data);
  return response.data;
};

export const updatePublishedLink = async (id: string, data: Partial<PublishedLink>): Promise<PublishedLink> => {
  const response = await apiClient.patch(`/published-links/${id}/`, data);
  return response.data;
};

export const deletePublishedLink = async (id: string): Promise<void> => {
  await apiClient.delete(`/published-links/${id}/`);
};

export const approvePublishedLink = async (id: string): Promise<{ message: string; status: string }> => {
  const response = await apiClient.post(`/published-links/${id}/approve/`);
  return response.data;
};

export const rejectPublishedLink = async (id: string, notes: string): Promise<{ message: string; status: string }> => {
  const response = await apiClient.post(`/published-links/${id}/reject/`, { notes });
  return response.data;
};

// Withdrawal Requests API
export const getWithdrawalRequests = async () => {
  const response = await apiClient.get('/withdrawal-requests/');
  return response.data;
};

export const createWithdrawalRequest = async (data: { 
  points: number; 
  payment_method: string;
  payment_details: any;
}): Promise<WithdrawalRequest> => {
  const response = await apiClient.post('/withdrawal-requests/', data);
  return response.data;
};

export const processWithdrawalRequest = async (
  id: string, 
  status: 'approved' | 'rejected' | 'completed',
  notes?: string,
  transaction_reference?: string
): Promise<{ message: string; status: string }> => {
  const response = await apiClient.post(`/withdrawal-requests/${id}/process/`, {
    status,
    notes,
    transaction_reference
  });
  return response.data;
};

// Admin Dashboard API
export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const response = await apiClient.get('admins/dashboard/');
  return response.data;
};

// Press Release Stats API
export const getPressReleaseStats = async (id: string): Promise<PressReleaseStats> => {
  const response = await apiClient.get(`/press-release/${id}/stats/`);
  return response.data;
};