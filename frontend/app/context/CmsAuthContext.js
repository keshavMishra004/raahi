"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

const CmsAuthContext = createContext();

export function CmsAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("cms_token");
    setToken(storedToken);
    setLoading(false);
  }, []);

  const login = (tokenData) => {
    setToken(tokenData);
    localStorage.setItem("cms_token", tokenData);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("cms_token");
    window.location.href = "/cms/login";
  };

  return (
    <CmsAuthContext.Provider value={{ token, login, logout, loading }}>
      {!loading && children}
    </CmsAuthContext.Provider>
  );
}

export function useCmsAuth() {
  return useContext(CmsAuthContext);
}
