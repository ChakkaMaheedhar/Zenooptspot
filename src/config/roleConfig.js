/**
 * Role Definitions and Permissions
 * Defines what each role can access and do in the system
 */

export const ROLES = {
  OWNER: "owner",
  MANAGER: "manager",
  STAFF: "staff",
};

/**
 * Menu item permissions by role
 * Determines which menu items are visible to each role
 * Includes both parent items and their children
 */
export const ROLE_MENU_PERMISSIONS = {
  owner: [
    // Welcome
    "welcome",
    // Users
    "users",
    // Businesses
    "businesses",
    // Metrics & children
    "metrics",
    "metrics-coupons",
    "metrics-meta",
    "metrics-google",
    "metrics-keywords",
    "metrics-link",
    "metrics-club",
    "metrics-reviews",
    // SMS & children
    "sms",
    "sms-marketing",
    "sms-retention",
    "sms-churn",
    "sms-contact",
    // Inbox
    "inbox",
    // Reviews
    "reviews",
    // Coupons & children
    "coupons",
    "coupons-all",
    // Campaigns & children
    "campaigns",
    // Resources & children
    "resources",
    "resources-forms",
    "resources-mac",
    "resources-podcast",
    "resources-feature",
    // Mobile & children
    "mobile",
    "mobile-kiosk",
    "mobile-ocard",
  ],
  manager: [
    // Welcome
    "welcome",
    // Users
    "users",
    // Businesses
    "businesses",
    // Metrics & children
    "metrics",
    "metrics-coupons",
    "metrics-meta",
    "metrics-google",
    "metrics-keywords",
    "metrics-link",
    "metrics-club",
    "metrics-reviews",
    // SMS & children
    "sms",
    "sms-marketing",
    "sms-retention",
    "sms-churn",
    "sms-contact",
    // Reviews
    "reviews",
    // Coupons & children
    "coupons",
    "coupons-all",
    // Campaigns & children
    "campaigns",
  ],
  staff: [
    // Welcome
    "welcome",
    // Businesses
    "businesses",
    // Reviews
    "reviews",
  ],
};

/**
 * Feature permissions by role
 * Determines what actions each role can perform
 */
export const ROLE_FEATURE_PERMISSIONS = {
  owner: {
    canSwitchBranches: true,
    canManageUsers: true,
    canViewAllData: true,
    canExport: true,
    canEditSettings: true,
    canViewMetrics: true,
    canSendSMS: true,
    canManageCampaigns: true,
    canViewReviews: true,
    canAccessMobile: true,
  },
  manager: {
    canSwitchBranches: false,
    canManageUsers: false,
    canViewAllData: false,
    canExport: false,
    canEditSettings: false,
    canViewMetrics: true,
    canSendSMS: true,
    canManageCampaigns: false,
    canViewReviews: true,
    canAccessMobile: false,
  },
  staff: {
    canSwitchBranches: false,
    canManageUsers: false,
    canViewAllData: false,
    canExport: false,
    canEditSettings: false,
    canViewMetrics: false,
    canSendSMS: false,
    canManageCampaigns: false,
    canViewReviews: true,
    canAccessMobile: false,
  },
};

/**
 * Branch access levels
 * Determines which branches a user can access
 */
export const BRANCH_ACCESS_TYPES = {
  ALL: "all", // Can access all branches (owner only)
  ASSIGNED: "assigned", // Can access only assigned branch
  NONE: "none", // No direct branch assignment
};
