import axios from "axios";

// Create Axios instance
const userApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5100",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available - try both 'token' and 'user_token'
userApi.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined" && config.headers) {
        const token = localStorage.getItem("token");
        const userToken = localStorage.getItem("user_token");
        const auth = token || userToken;
        if (auth) config.headers.Authorization = `Bearer ${auth}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally and retry /me 404 to alternative endpoints
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalConfig = error?.config || {};

    if (status === 401) {
      if (typeof window !== "undefined") {
        try { localStorage.removeItem("token"); } catch (e) {}
        try { localStorage.removeItem("user_token"); } catch (e) {}
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }

    // If backend returned 404 for a /me request, try common alternatives before failing
    try {
      const requestedUrl = originalConfig.url || "";
      const isMeRequest =
        requestedUrl === "/me" ||
        requestedUrl.endsWith("/me") ||
        requestedUrl === `${userApi.defaults.baseURL}/me` ||
        requestedUrl.endsWith("/user/me") ||
        requestedUrl.endsWith("/users/me") ||
        requestedUrl.endsWith("/auth/me");

      if (status === 404 && isMeRequest) {
        const tryPaths = ["/cms/users/me", "/auth/me", "/users/me", "/user/me", "/me"];
        const base = userApi.defaults.baseURL || "";

        for (const path of tryPaths) {
          try {
            const retryResp = await axios.request({
              ...originalConfig,
              url: base + path,
              headers: {
                ...(originalConfig.headers || {}),
                Authorization:
                  typeof window !== "undefined"
                    ? `Bearer ${localStorage.getItem("token") || localStorage.getItem("user_token")}`
                    : undefined,
              },
              withCredentials: true,
            });
            return retryResp;
          } catch (retryErr) {
            if (retryErr?.response?.status === 404) {
              continue;
            }
            throw retryErr;
          }
        }

        // Final fallback: if frontend has cached user snapshot, return it to avoid forced logout
        if (typeof window !== "undefined") {
          const cachedKeys = ["user", "currentUser", "cmsUser", "profile"];
          for (const k of cachedKeys) {
            try {
              const raw = localStorage.getItem(k);
              if (raw) {
                const parsed = JSON.parse(raw);
                const mockResponse = {
                  data: parsed,
                  status: 200,
                  statusText: "OK",
                  headers: {},
                  config: originalConfig,
                };
                return Promise.resolve(mockResponse);
              }
            } catch (e) {
              // ignore parse errors
            }
          }
        }
      }
    } catch (e) {
      // fall through to reject with original error
    }

    return Promise.reject(error);
  }
);

// Helper: try GET using the configured userApi so credentials/headers are applied
async function tryGet(path) {
  try {
    const res = await userApi.get(path);
    return res;
  } catch (err) {
    if (err?.response && err.response.status !== 404) throw err;
    return null; // 404 -> allow caller to try next candidate
  }
}

export async function getCurrentUser() {
  // try CMS-specific endpoint first, then common fallbacks
  const candidates = [
    "/cms/users/me",
    "/auth/me",
    "/users/me",
    "/user/me",
    "/me",
  ];

  for (const path of candidates) {
    const res = await tryGet(path);
    if (res && res.data) return res.data;
  }

  // fallback to any cached user in localStorage (prevents redirect loop if frontend still has session snapshot)
  if (typeof window !== "undefined") {
    const cachedKeys = ["user", "currentUser", "cmsUser", "profile"];
    for (const k of cachedKeys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        // ignore
      }
    }
  }

  return null;
}

export default userApi;
