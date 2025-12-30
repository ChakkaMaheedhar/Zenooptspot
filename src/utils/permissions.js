/**
 * Permission helper functions for role-based access control
 *
 * IMPORTANT: This system uses TWO separate role hierarchies:
 *
 * 1. ORGANIZATION ROLE (user.role from AuthContext)
 *    - Stored in: AdminUser.role
 *    - Determines: Global menu visibility and org-wide permissions
 *    - Values: "owner", "manager", "staff"
 *    - Org Owner: Can see ALL businesses in the organization
 *
 * 2. BUSINESS ROLE (getUserBusinessRole)
 *    - Stored in: BusinessUser.role
 *    - Determines: Actions within a SPECIFIC business
 *    - Values: "owner", "manager", "staff"
 *    - Business Owner: Can edit, delete, assign team in THAT business only
 *
 * EXAMPLE:
 *   User "john@acme.com":
 *   - Org Role: "manager" (sees sidebar for managers)
 *   - Business A: "owner" role (can delete Business A)
 *   - Business B: "staff" role (read-only in Business B)
 *
 *   When john views Business A → use businessRole for permissions (owner)
 *   When john views Business B → use businessRole for permissions (staff)
 */

/**
 * Check if user has required permission for a business action
 * This uses BUSINESS-LEVEL role hierarchy
 *
 * @param {string} userBusinessRole - User's role IN SPECIFIC BUSINESS (Owner, Manager, Staff)
 * @param {string} requiredRole - Minimum role required (Owner, Manager, Staff)
 * @returns {boolean} true if user has permission
 */
export const canPerformBusinessAction = (userBusinessRole, requiredRole) => {
  const roleHierarchy = {
    Owner: 3,
    Manager: 2,
    Staff: 1,
  };

  const userLevel = roleHierarchy[userBusinessRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
};

/**
 * Check if user can edit business details
 * Requires: Manager or Owner role IN THIS BUSINESS
 *
 * @param {string} userBusinessRole - Business-level role (from BusinessUser)
 * @returns {boolean}
 */
export const canEditBusiness = (userBusinessRole) => {
  return canPerformBusinessAction(userBusinessRole, "Manager");
};

/**
 * Check if user can delete business
 * Requires: Owner role IN THIS BUSINESS
 *
 * @param {string} userBusinessRole - Business-level role (from BusinessUser)
 * @returns {boolean}
 */
export const canDeleteBusiness = (userBusinessRole) => {
  return canPerformBusinessAction(userBusinessRole, "Owner");
};

/**
 * Check if user can assign/manage team members in this business
 * Requires: Manager or Owner role IN THIS BUSINESS
 *
 * @param {string} userBusinessRole - Business-level role (from BusinessUser)
 * @returns {boolean}
 */
export const canManageTeam = (userBusinessRole) => {
  return canPerformBusinessAction(userBusinessRole, "Manager");
};

/**
 * Check if user can change team member roles in this business
 * Requires: Owner role IN THIS BUSINESS (only owners can promote/demote)
 *
 * @param {string} userBusinessRole - Business-level role (from BusinessUser)
 * @returns {boolean}
 */
export const canChangeTeamRoles = (userBusinessRole) => {
  return canPerformBusinessAction(userBusinessRole, "Owner");
};

/**
 * Get user's BUSINESS-LEVEL role for a specific business
 *
 * @param {array} businessUsers - Array of BusinessUser objects for current business
 * @param {number} userId - User's ID (admin_user_id)
 * @returns {string|null} Business role ("owner", "manager", "staff") or null if not assigned
 */
export const getUserBusinessRole = (businessUsers, userId) => {
  const businessUser = businessUsers.find((bu) => bu.admin_user_id === userId);
  return businessUser ? businessUser.role : null;
};
