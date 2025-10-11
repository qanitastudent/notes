import axios from 'axios';

// Ganti dengan URL Railway backend Anda
export const API_URL = 'https://notes-production-8e61.up.railway.app';
console.log('🔍 API_URL:', API_URL); 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API Functions
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
};

export const notesAPI = {
  getAll: () => api.get('/notes'),
  
  getById: (id: number) => api.get(`/notes/${id}`),
  
  create: (data: { title: string; content: string; image_url?: string }) =>
    api.post('/notes', data),
  
  update: (id: number, data: { title: string; content: string; image_url?: string }) =>
    api.patch(`/notes/${id}`, data),
  
  delete: (id: number) => api.delete(`/notes/${id}`),
};

export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: () => api.delete('/upload/image'),
};
