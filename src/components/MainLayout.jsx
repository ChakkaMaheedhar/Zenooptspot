import { useState } from "react";
import { Layout, Menu, Space, Dropdown } from "antd";
import {
  UserOutlined,
  DownOutlined,
  HomeOutlined,
  BarChartOutlined,
  MessageOutlined,
  StarOutlined,
  BookOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./MainLayout.css";

const { Sider, Header, Content } = Layout;

export default function MainLayout({ children }) {
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const {
    user,
    organization,
    currentBranch,
    switchBranch,
    logout,
    getAccessibleBranches,
    canAccessMenuItem,
  } = useAuth();

  console.log("MainLayout render:", {
    hasUser: !!user,
    hasOrg: !!organization,
    hasChildren: !!children,
  });

  // Safety check - if user or org is missing, return null instead of crashing
  if (!user || !organization) {
    console.warn("MainLayout: user or organization missing", {
      user,
      organization,
    });
    return (
      <div style={{ padding: 20, color: "red" }}>
        Missing user or organization
      </div>
    );
  }

  const sidebarMenu = [
    {
      key: "welcome",
      label: "Welcome",
      icon: <HomeOutlined />,
    },
    {
      key: "users",
      label: "Team Members",
      icon: <UserOutlined />,
    },
    {
      key: "businesses",
      label: "Businesses",
      icon: <BarChartOutlined />,
    },
    {
      key: "metrics",
      type: "submenu",
      label: "Metrics",
      icon: <BarChartOutlined />,
      children: [
        { key: "metrics-coupons", label: "Coupons" },
        { key: "metrics-meta", label: "Meta Ads" },
        { key: "metrics-google", label: "Google Ads" },
        { key: "metrics-keywords", label: "Keywords" },
        { key: "metrics-link", label: "Link Tracker" },
        { key: "metrics-club", label: "Club Members" },
        { key: "metrics-reviews", label: "Online Reviews" },
      ],
    },
    {
      key: "sms",
      type: "submenu",
      label: "SMS",
      icon: <MessageOutlined />,
      children: [
        { key: "sms-marketing", label: "Marketing" },
        { key: "sms-retention", label: "Retention" },
        { key: "sms-churn", label: "Churn" },
        { key: "sms-contact", label: "Contact Opt Out" },
      ],
    },
    {
      key: "inbox",
      label: "Message Inbox",
      icon: <MessageOutlined />,
    },
    {
      key: "reviews",
      label: "Reviews",
      icon: <StarOutlined />,
    },
    {
      key: "coupons",
      type: "submenu",
      label: "Coupons",
      icon: <BookOutlined />,
      children: [{ key: "coupons-all", label: "All Coupons" }],
    },
    {
      key: "campaigns",
      label: "Campaigns",
      icon: <MessageOutlined />,
    },
    {
      key: "resources",
      type: "submenu",
      label: "Resources",
      icon: <BookOutlined />,
      children: [
        { key: "resources-forms", label: "Forms" },
        { key: "resources-mac", label: "Member Acquisition Cost Calculator" },
        { key: "resources-podcast", label: "Cheers to Freedom Podcast" },
        { key: "resources-feature", label: "Feature Request" },
      ],
    },
    {
      key: "mobile",
      type: "submenu",
      label: "Mobile",
      icon: <MobileOutlined />,
      children: [
        { key: "mobile-kiosk", label: "Kiosk" },
        { key: "mobile-ocard", label: "oCard" },
      ],
    },
  ];

  // Filter menu items based on user role
  const getFilteredMenu = () => {
    return sidebarMenu
      .map((item) => {
        // Check if user can access this main menu item
        if (!canAccessMenuItem(item.key)) {
          return null;
        }

        // If menu item has children, filter them too
        if (item.children && item.children.length > 0) {
          const filteredChildren = item.children.filter((child) =>
            canAccessMenuItem(child.key)
          );

          // If parent item is accessible but has no accessible children, still show parent
          return {
            ...item,
            children: filteredChildren,
          };
        }

        return item;
      })
      .filter(Boolean); // Remove null items
  };

  const userMenuItems = [
    {
      key: "email",
      label: (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>Signed in as</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{user?.email}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            {organization?.name}
          </div>
        </div>
      ),
    },
    { type: "divider" },
    { key: "profile", label: "My Profile" },
    { key: "settings", label: "Account Settings" },
    { key: "billing", label: "Billing" },
    { type: "divider" },
    { key: "logout", label: "Sign Out", onClick: () => handleLogout() },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (info) => {
    const navigationMap = {
      welcome: "/welcome",
      users: "/users",
      businesses: "/businesses",
      "metrics-coupons": "/metrics-coupons",
      "metrics-meta": "/metrics-meta",
      "metrics-google": "/metrics-google",
      "metrics-keywords": "/metrics-keywords",
      "metrics-link": "/metrics-link",
      "metrics-club": "/metrics-club",
      "metrics-reviews": "/metrics-reviews",
      "sms-marketing": "/sms-marketing",
      "sms-retention": "/sms-retention",
      "sms-churn": "/sms-churn",
      "sms-contact": "/sms-contact",
      inbox: "/inbox",
      reviews: "/reviews",
      "coupons-all": "/coupons-all",
      campaigns: "/campaigns",
      "resources-forms": "/resources-forms",
      "resources-mac": "/resources-mac",
      "resources-podcast": "/resources-podcast",
      "resources-feature": "/resources-feature",
      "mobile-kiosk": "/mobile/kiosk",
      "mobile-ocard": "/mobile/ocard",
    };

    if (navigationMap[info.key]) {
      navigate(navigationMap[info.key]);
    }
  };

  // ✅ FIXED TOGGLE LOGIC
  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));

    if (!latestOpenKey) {
      setOpenKeys([]); // close if clicking same submenu
    } else {
      setOpenKeys([latestOpenKey]); // only one open at a time
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        width={260}
        style={{
          background: "#00523f",
          display: "flex",
          flexDirection: "column",
          padding: "12px",
          height: "100vh",
          overflow: "hidden",
        }}
        theme="dark"
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
            padding: "12px",
            background: "rgba(255, 196, 42, 0.1)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #FFC42A 0%, #FF9800 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "700",
              color: "#00523f",
            }}
          >
            Z
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            ZenoOptSpot
          </div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            mode="inline"
            theme="dark"
            items={getFilteredMenu()}
            onSelect={handleMenuClick}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            style={{
              background: "transparent",
              borderRight: "none",
            }}
          />
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#ffffff",
            borderBottom: "2px solid #ccebe5",
            padding: "0 24px",
            height: 64,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            {organization?.name}
            {currentBranch && <span> | {currentBranch.name}</span>}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            {/* Branch Selector - Show for Owner or all users */}
            {user && getAccessibleBranches().length > 1 && (
              <select
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #ccebe5",
                  background: "#ccebe5",
                  fontSize: "12px",
                  color: "#00523f",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                value={currentBranch?.id || ""}
                onChange={(e) => switchBranch(e.target.value)}
              >
                <option value="">Select Branch</option>
                {getAccessibleBranches().map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}

            {/* User Dropdown Menu */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: "pointer" }}>
                <UserOutlined />
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            flex: 1,
            overflow: "auto",
            background: "#f0f9f7",
            padding: "24px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
