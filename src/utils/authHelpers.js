// src/utils/authHelpers.js

// Helper function to trigger auth state update across the app
export const triggerAuthStateUpdate = () => {
  window.dispatchEvent(new Event("authStateChanged"));
};

// Helper function to set user data and trigger update
export const setAuthData = (token, userData) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));
  triggerAuthStateUpdate();
};

// Helper function to clear auth data and trigger update
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  triggerAuthStateUpdate();
};

// Helper function to get current user data
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();
  return !!(token && user);
};

// Helper function to get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Helper function for role-based redirects
export const getRoleDashboardPath = (role) => {
  switch (role) {
    case "publisher":
      return "/publisher-dashboard";
    case "advertiser":
      return "/advertiser-dashboard";
    default:
      return "/login";
  }
};