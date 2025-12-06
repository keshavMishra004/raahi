import axios from "axios";

const DEFAULT_API = "http://localhost:5100";

const computeBaseUrl = () => {
  // 1) Use explicit env if provided (recommended)
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  // 2) In browser derive from current hostname (use hostname not host to avoid existing port)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname; // e.g. "localhost" (no port)
    const protocol = window.location.protocol; // "http:" or "https:"
    return `${protocol}//${hostname}:5100`;
  }

  // 3) Server-side fallback
  return DEFAULT_API;
};

const API_URL = computeBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach CMS operator token to all requests (Authorization: Bearer <cms_token>)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cms_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      // Network level issue: backend unreachable, CORS, or wrong baseURL
      console.error("API Network Error:", err.message);
      console.error("Axios attempted baseURL:", API_URL);
      console.error(
        "Check: backend running on that URL, FRONTEND env NEXT_PUBLIC_API_URL, and CORS settings on backend."
      );
    }
    return Promise.reject(err);
  }
);

export default api;
