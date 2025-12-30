import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, organization, branch, switchBranch, logout } = useAuth();
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateTo = (path, itemKey) => {
    setActiveItem(itemKey);
    navigate(path);
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", path: "/dashboard" },
    { key: "businesses", label: "Businesses", path: "/businesses" },
    { key: "ocard", label: "oCard", path: "/dashboard/mobile/ocard" },
    { key: "kiosk", label: "Kiosk", path: "/kiosk" },
  ];

  return (
    <div style={styles.sidebar}>
      {/* Logo Section */}
      <div style={styles.logoSection}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>Z</div>
          <div style={styles.logoText}>ZenoOptSpot</div>
        </div>
      </div>

      {/* User Info */}
      <div style={styles.userInfo}>
        <p style={styles.infoLabel}>Signed in as</p>
        <p style={styles.email}>{user?.email}</p>
        <p style={styles.org}>{organization?.name}</p>
        {user?.role === "owner" && branch && (
          <p style={styles.branch}>Branch: {branch.name}</p>
        )}
      </div>

      {/* Branch Selector */}
      {user?.role === "owner" && (
        <div style={styles.branchSelector}>
          <label style={styles.selectorLabel}>Switch Branch</label>
          <select
            style={styles.select}
            value={branch?.id || ""}
            onChange={(e) => switchBranch(e.target.value)}
          >
            <option value="">Select branch</option>
            {organization?.branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Items */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.key}
            style={{
              ...styles.navItem,
              ...(activeItem === item.key ? styles.navItemActive : {}),
            }}
            onClick={() => navigateTo(item.path, item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button style={styles.logoutBtn} onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    background: "#00523f",
    color: "white",
    padding: "12px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  logoSection: {
    marginBottom: "32px",
    paddingTop: "8px",
    flexShrink: 0,
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px",
    background: "rgba(255, 196, 42, 0.1)",
    borderRadius: "10px",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #FFC42A 0%, #FF9800 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    color: "#00523f",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    color: "#ffffff",
  },
  userInfo: {
    background: "rgba(255, 255, 255, 0.06)",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "12px",
    border: "1px solid rgba(204, 235, 229, 0.2)",
    flexShrink: 0,
  },
  infoLabel: {
    margin: "0 0 4px 0",
    fontSize: "11px",
    opacity: "0.7",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  email: {
    margin: "4px 0",
    fontWeight: "600",
    fontSize: "13px",
    color: "#ffffff",
  },
  org: {
    margin: "2px 0",
    opacity: "0.8",
    fontSize: "12px",
  },
  branch: {
    margin: "4px 0",
    color: "#FFC42A",
    fontSize: "12px",
    fontWeight: "500",
  },
  branchSelector: {
    marginBottom: "12px",
    flexShrink: 0,
  },
  selectorLabel: {
    display: "block",
    fontSize: "11px",
    opacity: "0.7",
    textTransform: "uppercase",
    marginBottom: "6px",
    letterSpacing: "0.5px",
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid rgba(204, 235, 229, 0.3)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  nav: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "12px",
    minHeight: 0,
  },
  navItem: {
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.8)",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.25s ease",
    textAlign: "left",
  },
  navItemActive: {
    background: "#FFC42A",
    color: "#00523f",
    border: "1px solid #FFC42A",
    fontWeight: "600",
  },
  logoutBtn: {
    background: "rgba(255, 196, 42, 0.15)",
    border: "1px solid #FFC42A",
    color: "#FFC42A",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.25s ease",
    flexShrink: 0,
  },
};
