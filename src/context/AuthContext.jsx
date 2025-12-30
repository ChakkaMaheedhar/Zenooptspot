import { useState, useEffect } from "react";
import {
  ROLE_FEATURE_PERMISSIONS,
  ROLE_MENU_PERMISSIONS,
} from "../config/roleConfig";
import { AuthContext } from "./AuthContextProvider";

export function AuthProvider({ children }) {
  // Initialize state from localStorage IMMEDIATELY on mount
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("zeno_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [organization, setOrganization] = useState(() => {
    try {
      const saved = localStorage.getItem("zeno_organization");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentBranch, setCurrentBranch] = useState(() => {
    try {
      const saved = localStorage.getItem("zeno_currentBranch");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [branch, setBranch] = useState(null);
  const [isLoading] = useState(false);

  // Listen for storage changes (e.g., when login happens in another tab or component)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "zeno_user" || !e.key) {
        try {
          const saved = localStorage.getItem("zeno_user");
          setUser(saved ? JSON.parse(saved) : null);
        } catch {
          setUser(null);
        }
      }
      if (e.key === "zeno_organization" || !e.key) {
        try {
          const saved = localStorage.getItem("zeno_organization");
          setOrganization(saved ? JSON.parse(saved) : null);
        } catch {
          setOrganization(null);
        }
      }
      if (e.key === "zeno_currentBranch" || !e.key) {
        try {
          const saved = localStorage.getItem("zeno_currentBranch");
          setCurrentBranch(saved ? JSON.parse(saved) : null);
        } catch {
          setCurrentBranch(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Poll localStorage for changes (handles same-tab updates)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const savedUser = localStorage.getItem("zeno_user");
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;

        // Only update if changed
        setUser((prevUser) => {
          const prevStr = JSON.stringify(prevUser);
          const newStr = JSON.stringify(parsedUser);
          if (prevStr !== newStr) {
            console.log("User state updated from localStorage");
            return parsedUser;
          }
          return prevUser;
        });

        const savedOrg = localStorage.getItem("zeno_organization");
        const parsedOrg = savedOrg ? JSON.parse(savedOrg) : null;

        setOrganization((prevOrg) => {
          const prevStr = JSON.stringify(prevOrg);
          const newStr = JSON.stringify(parsedOrg);
          if (prevStr !== newStr) {
            console.log("Organization state updated from localStorage");
            return parsedOrg;
          }
          return prevOrg;
        });

        const savedBranch = localStorage.getItem("zeno_currentBranch");
        const parsedBranch = savedBranch ? JSON.parse(savedBranch) : null;

        setCurrentBranch((prevBranch) => {
          const prevStr = JSON.stringify(prevBranch);
          const newStr = JSON.stringify(parsedBranch);
          if (prevStr !== newStr) {
            console.log("CurrentBranch state updated from localStorage");
            return parsedBranch;
          }
          return prevBranch;
        });
      } catch (error) {
        console.error("Error polling localStorage:", error);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.detail || "Login failed" };
      }

      const data = await response.json();
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        organizationId: data.user.organization_id,
      };

      setUser(userData);
      localStorage.setItem("zeno_token", data.token);
      localStorage.setItem("zeno_user", JSON.stringify(userData));

      const mockOrg = {
        id: data.user.organization_id,
        name: `Organization ${data.user.organization_id}`,
        branches: [
          { id: 1, name: "Main Branch" },
          { id: 2, name: "Downtown" },
          { id: 3, name: "Airport" },
        ],
      };
      setOrganization(mockOrg);
      localStorage.setItem("zeno_organization", JSON.stringify(mockOrg));

      setCurrentBranch(mockOrg.branches[0]);
      localStorage.setItem(
        "zeno_currentBranch",
        JSON.stringify(mockOrg.branches[0])
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const switchBranch = (branchId) => {
    // Check if user can access this branch
    if (!canAccessBranch(branchId)) {
      console.warn(`User cannot access branch ${branchId}`);
      return false;
    }

    const selectedBranch = organization.branches.find((b) => b.id === branchId);
    setCurrentBranch(selectedBranch);
    localStorage.setItem("zeno_currentBranch", JSON.stringify(selectedBranch));
    return true;
  };

  /**
   * Check if current user can access a specific branch
   */
  const canAccessBranch = (branchId) => {
    if (!user) return false;
    return user.accessibleBranches?.includes(branchId) || false;
  };

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permissionKey) => {
    if (!user) return false;
    const rolePermissions = ROLE_FEATURE_PERMISSIONS[user.role];
    return rolePermissions?.[permissionKey] || false;
  };

  /**
   * Check if user can access a menu item
   */
  const canAccessMenuItem = (menuKey) => {
    if (!user) return false;
    const allowedMenuItems = ROLE_MENU_PERMISSIONS[user.role] || [];
    return allowedMenuItems.includes(menuKey);
  };

  /**
   * Get all accessible branches for current user
   */
  const getAccessibleBranches = () => {
    if (!user || !organization) return [];
    return organization.branches.filter((b) =>
      user.accessibleBranches?.includes(b.id)
    );
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    setBranch(null);
    setCurrentBranch(null);
    // Clear localStorage
    localStorage.removeItem("zeno_token");
    localStorage.removeItem("zeno_user");
    localStorage.removeItem("zeno_organization");
    localStorage.removeItem("zeno_currentBranch");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        branch, // Assigned branch (null for owner)
        currentBranch, // Currently selected branch
        isLoading,
        login,
        logout,
        switchBranch,
        canAccessBranch,
        hasPermission,
        canAccessMenuItem,
        getAccessibleBranches,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
