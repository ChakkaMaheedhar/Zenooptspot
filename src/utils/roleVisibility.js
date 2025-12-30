/**
 * Role-based visibility utilities
 * Use these to control what different roles see in pages
 */

export const rolePermissions = {
  // What each role can see
  owner: {
    viewFinancials: true,
    viewAnalytics: true,
    viewRevenue: true,
    viewAllTransactions: true,
    viewStaffData: true,
    viewSettings: true,
  },
  manager: {
    viewFinancials: false,
    viewAnalytics: true,
    viewRevenue: false,
    viewAllTransactions: false,
    viewStaffData: false,
    viewSettings: false,
  },
  staff: {
    viewFinancials: false,
    viewAnalytics: false,
    viewRevenue: false,
    viewAllTransactions: false,
    viewStaffData: false,
    viewSettings: false,
  },
};

/**
 * Get visibility flags for current user role
 * Usage: const visibility = getVisibility(user?.role);
 */
export function getVisibility(role) {
  return rolePermissions[role] || rolePermissions.staff;
}

/**
 * Check if role can view specific feature
 * Usage: if (canView(user?.role, 'viewFinancials')) { ... }
 */
export function canView(role, feature) {
  return rolePermissions[role]?.[feature] || false;
}
