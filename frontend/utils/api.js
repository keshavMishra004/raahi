import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

// Fallback GET that constructs a full URL from NEXT_PUBLIC_API_URL or localhost
api.rawGet = (path, opts = {}) => {
  const base = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')) || 'http://localhost:5000/api';
  const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
  return axios.get(url, opts);
};

// Response interceptor: log useful info and surface friendly alerts
api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error('[API ERROR]', { status, message: error.message, data });
    if (status === 413) {
      alert('Uploaded file is too large. Choose a smaller image.');
    } else if (status >= 500) {
      // show generic server error to user
      alert('Server error occurred. Please try again later.');
    } else if (status === 401) {
      // optional: handle auth
      console.warn('Unauthorized - token may be invalid.');
    }
    return Promise.reject(error);
  }
);

export default api;
