import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Table,
  Button,
  Select,
  Space,
  message,
  Spin,
  Tooltip,
} from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { useAuth } from "../../context/useAuth";
import {
  canManageTeam,
  canChangeTeamRoles,
  getUserBusinessRole,
} from "../../utils/permissions";

/**
 * AssignTeamMembersModal - Manage team assignments for a specific business
 *
 * PERMISSION MODEL:
 * - Organization Owners (user.role === 'owner') → Can assign/manage/edit roles in ANY business
 * - Business Managers/Owners (businessRole in ['owner', 'manager']) → Can assign/manage in THAT business
 * - Business Staff → Read-only, cannot make changes
 *
 * ROLE HIERARCHY (BUSINESS-LEVEL):
 * - Owner: Can assign users, remove users, change their roles
 * - Manager: Can assign users, remove users, but CANNOT change roles (owner only)
 * - Staff: Cannot make any changes (read-only access)
 */
const AssignTeamMembersModal = ({
  visible,
  business,
  onClose,
  onAssignSuccess,
}) => {
  const { user } = useAuth(); // user.role = ORG level, used for global override
  const [teamMembers, setTeamMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState({});

  const fetchAssignedMembers = useCallback(async () => {
    if (!business?.id) return;
    try {
      const response = await api.get(`/businesses/${business.id}/users/`);
      console.log("Assigned members response:", response);
      setAssignedMembers(response || []);
    } catch (error) {
      console.log("No assigned members yet or error fetching", error);
      setAssignedMembers([]);
    }
  }, [business?.id]);

  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/");
      console.log("Team members response:", response);
      setTeamMembers(response || []);
      // Initialize selectedRole with 'staff' for each member
      const initialRoles = {};
      (response || []).forEach((member) => {
        initialRoles[member.id] = "staff";
      });
      setSelectedRole(initialRoles);
    } catch (error) {
      message.error("Failed to load team members");
      console.error("Team members error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible && business?.id) {
      console.log("Modal visible, fetching for business:", business.id);
      fetchTeamMembers();
      fetchAssignedMembers();
    }
  }, [visible, business?.id, fetchTeamMembers, fetchAssignedMembers]);

  const handleAssignMember = async (memberId) => {
    const role = selectedRole[memberId] || "staff";
    try {
      await api.post(`/businesses/${business?.id}/assign-user/`, {
        admin_user_id: memberId,
        role: role,
      });
      message.success("Team member assigned successfully");
      setSelectedRole({ ...selectedRole, [memberId]: undefined });
      fetchAssignedMembers();
      if (onAssignSuccess) onAssignSuccess();
    } catch (err) {
      message.error("Failed to assign team member");
      console.error(err);
    }
  };

  const handleRemoveMember = async (assignmentId) => {
    try {
      await api.delete(`/businesses/users/${assignmentId}/`);
      message.success("Team member removed successfully");
      fetchAssignedMembers();
      if (onAssignSuccess) onAssignSuccess();
    } catch (err) {
      message.error("Failed to remove team member");
      console.error(err);
    }
  };

  const handleUpdateRole = async (assignmentId, newRole) => {
    try {
      await api.put(`/businesses/users/${assignmentId}`, {
        role: newRole,
      });
      message.success("Role updated successfully");
      fetchAssignedMembers();
      if (onAssignSuccess) onAssignSuccess();
    } catch (err) {
      message.error("Failed to update role");
      console.error(err);
    }
  };

  // Filter out already assigned members
  const unassignedMembers = teamMembers.filter(
    (member) => !assignedMembers.some((am) => am.id === member.id)
  );

  // Get current user's BUSINESS-LEVEL role in THIS business
  const userRole = getUserBusinessRole(assignedMembers, user?.id);

  // Organization owners have full permissions everywhere (override business role)
  // Other users need explicit Manager/Owner role IN THIS BUSINESS
  const canManage = user?.role === "owner" || canManageTeam(userRole);
  const canChangeRoles = user?.role === "owner" || canChangeTeamRoles(userRole);

  // Show warning message only if:
  // - User is NOT an org owner AND
  // - User is NOT assigned to this business (userRole = null)
  const hasNoRole = userRole === null && user?.role !== "owner";

  const assignedColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "35%",
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      width: "25%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
      render: (role, record) => (
        <Tooltip
          title={!canChangeRoles ? "Owner role required to change roles" : ""}
        >
          <Select
            value={role}
            onChange={(newRole) =>
              handleUpdateRole(record.assignment_id, newRole)
            }
            style={{ width: "100%" }}
            disabled={!canChangeRoles}
          >
            <Select.Option value="owner">Owner</Select.Option>
            <Select.Option value="manager">Manager</Select.Option>
            <Select.Option value="staff">Staff</Select.Option>
          </Select>
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <Tooltip
          title={!canManage ? "Manager role required to remove members" : ""}
        >
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleRemoveMember(record.assignment_id)}
            disabled={!canManage}
          >
            Remove
          </Button>
        </Tooltip>
      ),
    },
  ];

  const unassignedColumns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      width: "20%",
    },
    {
      title: "Role",
      key: "role",
      width: "20%",
      render: (_, record) => (
        <Select
          value={selectedRole[record.id] || "staff"}
          onChange={(value) =>
            setSelectedRole({ ...selectedRole, [record.id]: value })
          }
          style={{ width: "100%" }}
          disabled={!canManage}
        >
          <Select.Option value="owner">Owner</Select.Option>
          <Select.Option value="manager">Manager</Select.Option>
          <Select.Option value="staff">Staff</Select.Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <Tooltip
          title={!canManage ? "Manager role required to assign members" : ""}
        >
          <Button
            type="primary"
            size="small"
            icon={<UserAddOutlined />}
            onClick={() => handleAssignMember(record.id)}
            disabled={!canManage}
          >
            Assign
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <Modal
      title={`Assign Team Members to ${business?.name}`}
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        {hasNoRole && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fff7e6",
              borderRadius: "4px",
              marginBottom: "20px",
              border: "1px solid #ffc069",
              color: "#ad6800",
            }}
          >
            <strong>ℹ️ Note:</strong> You're not assigned to this business yet.
            Assign yourself with a Manager or Owner role to manage team members.
          </div>
        )}
        <div style={{ marginBottom: 30 }}>
          <h3>Currently Assigned Members</h3>
          {assignedMembers.length > 0 ? (
            <Table
              dataSource={assignedMembers}
              columns={assignedColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          ) : (
            <p>No team members assigned yet</p>
          )}
        </div>

        <div>
          <h3>Available Team Members</h3>
          {unassignedMembers.length > 0 ? (
            <Table
              dataSource={unassignedMembers}
              columns={unassignedColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          ) : (
            <p>All team members are already assigned</p>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default AssignTeamMembersModal;
