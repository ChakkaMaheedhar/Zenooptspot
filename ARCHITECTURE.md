# Zenooptspot - Role-Based Permission Architecture

## Overview

Zenooptspot uses a **dual-role permission system** to support multi-tenant operations where users can have different permissions in different businesses within the same organization.

---

## Role Hierarchy

### Two Separate Role Levels

```
┌─────────────────────────────────────────────────────────────┐
│                   ORGANIZATION LEVEL                        │
│  User's role in the organization (owner, manager, staff)    │
│  Controls: Menu visibility, global feature access           │
│  Examples: Can user see Businesses page? Can they register? │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LEVEL                           │
│  User's role WITHIN each business (owner, manager, staff)   │
│  Controls: Actions in specific business                     │
│  Examples: Can user edit this business? Delete it? Assign   │
│            team members?                                    │
└─────────────────────────────────────────────────────────────┘
```

### Role Values

Both levels use the same role names but in different contexts:

| Role        | Org Level                                                   | Business Level                                                     |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| **Owner**   | Can create businesses, manage all users, see all businesses | Can edit/delete business, change team member roles                 |
| **Manager** | Can see sidebar menus, limited global access                | Can edit business, assign/remove team members (can't change roles) |
| **Staff**   | Basic access, can use assigned features                     | Read-only in business, no edits allowed                            |

---

## Database Schema

### AdminUser Table

```sql
CREATE TABLE admin_user (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE,
    role VARCHAR,  -- 'owner', 'manager', 'staff' (ORGANIZATION LEVEL)
    organization_id INTEGER FOREIGN KEY,
    is_active BOOLEAN
)
```

### BusinessUser Table (Junction)

```sql
CREATE TABLE business_user (
    id INTEGER PRIMARY KEY,
    admin_user_id INTEGER FOREIGN KEY,
    business_id INTEGER FOREIGN KEY,
    role VARCHAR,  -- 'owner', 'manager', 'staff' (BUSINESS LEVEL)
    created_at TIMESTAMP
)
```

**Key Point:** Same `role` column name in both tables, but represents different things!

---

## Permission Checks

### 1. Organization-Level Checks (Backend)

**File:** `src/routes/businesses.py` → `GET /api/businesses/`

```python
# Check: Can user see this business?
if current_user.role == 'owner':
    # Org owner: See ALL businesses in organization
    businesses = db.query(Business).filter(
        Business.organization_id == current_user.organization_id
    ).all()
else:
    # Non-owner: See ONLY assigned businesses
    businesses = db.query(Business).join(BusinessUser).filter(
        Business.organization_id == current_user.organization_id,
        BusinessUser.admin_user_id == current_user.id
    ).all()
```

### 2. Business-Level Checks (Frontend)

**File:** `src/utils/permissions.js`

```javascript
// Check: Can user edit THIS BUSINESS?
const businessRole = getUserBusinessRole(businessUsers, userId);
const canEdit = canEditBusiness(businessRole); // Needs 'manager' or 'owner'

// Check: Can user delete THIS BUSINESS?
const canDelete = canDeleteBusiness(businessRole); // Needs 'owner' only
```

---

## Real-World Example

### Scenario: Multi-Business Organization

**Organization:** Acme Corp

- **Owner:** John (john@acme.com)

  - Org Role: `owner`
  - Can: Create businesses, see all, manage anyone

- **Manager:** Mary (mary@acme.com)

  - Org Role: `manager`
  - Assignments:
    - Business A: Role = `owner` (full control of Business A)
    - Business B: Role = `staff` (read-only in Business B)

- **Staff:** Sue (sue@acme.com)
  - Org Role: `staff`
  - Assignments:
    - Business A: Role = `manager` (can edit Business A, manage team)
    - Business B: Role = `staff` (read-only in Business B)

### Permission Matrix

| User                   | Action      | Business A                | Business B      | Business C      |
| ---------------------- | ----------- | ------------------------- | --------------- | --------------- |
| **John** (Org Owner)   | View        | ✅                        | ✅              | ✅              |
|                        | Edit        | ✅                        | ✅              | ✅              |
|                        | Delete      | ✅                        | ✅              | ✅              |
|                        | Assign Team | ✅                        | ✅              | ✅              |
| **Mary** (Org Manager) | View        | ✅                        | ✅              | ❌ Not assigned |
|                        | Edit        | ✅ (Owner role)           | ❌ (Staff role) | ❌              |
|                        | Delete      | ✅ (Owner role)           | ❌ (Staff role) | ❌              |
|                        | Assign Team | ✅ (Owner role)           | ❌ (Staff role) | ❌              |
| **Sue** (Org Staff)    | View        | ✅                        | ✅              | ❌ Not assigned |
|                        | Edit        | ✅ (Manager role)         | ❌ (Staff role) | ❌              |
|                        | Delete      | ❌ (Manager can't delete) | ❌ (Staff role) | ❌              |
|                        | Assign Team | ✅ (Manager role)         | ❌ (Staff role) | ❌              |

### How It Works Step-by-Step

1. **Login as Mary**

   - Backend fetches her organization role: `manager`
   - Frontend renders sidebar based on manager permissions

2. **Navigate to Businesses**

   - Backend checks: `current_user.role == 'owner'`? No.
   - Backend filters: Show businesses where Mary is assigned
   - Result: Business A and B shown, Business C hidden

3. **View Business A**

   - Frontend fetches: Mary's role in Business A = `owner`
   - Edit button: ✅ Enabled (owner can edit)
   - Delete button: ✅ Enabled (owner can delete)
   - Team button: ✅ Enabled (owner can assign)

4. **View Business B**
   - Frontend fetches: Mary's role in Business B = `staff`
   - Edit button: ❌ Disabled (staff can't edit)
   - Delete button: ❌ Disabled (staff can't delete)
   - Team button: ❌ Disabled (staff can't assign)

---

## Code Locations

### Frontend

- **Role check utilities:** `src/utils/permissions.js`
- **Business filtering:** `src/pages/Businesses/BusinessPage.jsx`
- **Team management:** `src/pages/Businesses/AssignTeamMembersModal.jsx`
- **User management:** `src/pages/Users/UsersPage.jsx`

### Backend

- **Org-level filtering:** `src/routes/businesses.py` → `GET /businesses/`
- **Permission enforcement:** `src/routes/businesses.py` → `PUT/DELETE` endpoints
- **Team assignment:** `src/routes/businesses.py` → `POST /assign-user`, `PUT /update role`

### Context

- **Current user:** `src/context/useAuth.jsx` → `user.role` (org level)

---

## Common Mistakes to Avoid

### ❌ Wrong

```javascript
// Checking org role when you need business role
if (user.role === "manager") {
  // Can edit business?
}
```

### ✅ Correct

```javascript
// Check business-level role
const businessRole = getUserBusinessRole(businessUsers, user.id);
if (canEditBusiness(businessRole)) {
  // Can edit this specific business
}
```

---

## When to Use Which Role

| Scenario                                    | Use                              |
| ------------------------------------------- | -------------------------------- |
| Checking if user should see sidebar menu    | `user.role` (org level)          |
| Checking if user can see a business in list | Backend org-level check          |
| Checking if user can edit this business     | `businessRole` from BusinessUser |
| Checking if user can delete this business   | `businessRole` from BusinessUser |
| Checking if user can access Team modal      | `businessRole` from BusinessUser |

---

## Future Enhancements

1. **Rename for clarity** (Optional)

   - AdminUser.`role` → AdminUser.`org_role`
   - BusinessUser.`role` → BusinessUser.`business_role`
   - This would eliminate all confusion

2. **Custom roles**

   - Allow organizations to define custom roles
   - Example: "Supervisor", "Coordinator"

3. **Feature-based permissions**

   - Instead of role-based, use feature flags
   - Example: `can_manage_team_members: true`

4. **Time-limited access**
   - Assign roles with expiration dates
   - Automatic role revocation

---

## Testing the System

### Test Case 1: Org Owner sees all businesses

```
1. Login as owner@test.com
2. Go to Businesses
3. Should see all 5+ businesses
```

### Test Case 2: Staff user sees only assigned business

```
1. Assign staff@test.com to Business A only
2. Login as staff@test.com
3. Go to Businesses
4. Should see ONLY Business A
```

### Test Case 3: Manager can edit but not delete

```
1. Assign manager@test.com as Manager to Business A
2. Login as manager@test.com
3. Click Team on Business A
4. Should see: Edit ENABLED ✅, Delete DISABLED ❌
```

### Test Case 4: Owner can change team roles

```
1. Login as owner (has business owner role)
2. Click Team on any business
3. Should see: Role dropdown ENABLED ✅
4. Login as manager (has business manager role)
5. Click Team
6. Should see: Role dropdown DISABLED ❌
```

---

## Summary

- **Two role levels:** Organization (user.role) and Business (businessUser.role)
- **Same role names, different meanings:** 'owner' at org level ≠ 'owner' at business level
- **Check the right level:** Org role for menus, business role for actions
- **Simple rule:** If checking permissions for a specific business action, use business role!
