import axios from "axios";

// Create Axios instance
const userApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5100",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
userApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("user_token");
      if (token) {
        // Ensure headers object exists
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_token");
        // avoid redirect loop if already on login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default userApi;
