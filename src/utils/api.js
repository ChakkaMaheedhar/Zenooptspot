// API Configuration
export const API_BASE_URL = "http://127.0.0.1:8001";

// Helper function to get auth token
const getAuthToken = () => {
  try {
    const token = localStorage.getItem("zeno_token");
    return token || null;
  } catch {
    return null;
  }
};

// Helper to ensure endpoint has /api prefix
const getFullEndpoint = (endpoint) => {
  if (!endpoint.startsWith("/api/")) {
    return `/api${endpoint}`;
  }
  return endpoint;
};

// Generic API client with GET, POST, PUT, DELETE methods
const api = {
  get: async (endpoint) => {
    const token = getAuthToken();
    const fullEndpoint = getFullEndpoint(endpoint);
    const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  },

  post: async (endpoint, data) => {
    const token = getAuthToken();
    const fullEndpoint = getFullEndpoint(endpoint);
    const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  },

  put: async (endpoint, data) => {
    const token = getAuthToken();
    const fullEndpoint = getFullEndpoint(endpoint);
    const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  },

  delete: async (endpoint) => {
    const token = getAuthToken();
    const fullEndpoint = getFullEndpoint(endpoint);
    const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "API request failed");
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      return null;
    }

    return response.json();
  },
};

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  },

  register: async (email, password, organizationName = null) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        organization_name: organizationName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to get profile");
    }

    return response.json();
  },

  health: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};

// Export the generic API client as default
export default api;
