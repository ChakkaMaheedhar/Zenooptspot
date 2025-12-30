import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Card,
  Empty,
  Spin,
  Tooltip,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { useAuth } from "../../context/useAuth";
import "./UsersPage.css";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Only Owners and Managers can manage organization-level users
  const canManageUsers = user?.role === "owner" || user?.role === "manager";
  const canDeleteUsers = user?.role === "owner";

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/");
      setUsers(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      message.error("Failed to fetch users");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setIsEditMode(false);
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRole = (user) => {
    setIsEditMode(true);
    setEditingUser(user);
    form.setFieldsValue({
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleModalOk = async (values) => {
    try {
      setLoading(true);
      if (isEditMode) {
        // Update user role
        await api.put(`/users/${editingUser.id}/role`, {
          role: values.role,
        });
        message.success("User role updated successfully");
      } else {
        // Create new user
        await api.post("/users/", {
          email: values.email,
          password: values.password,
          full_name: values.full_name || values.email.split("@")[0],
        });
        message.success("User created successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      await fetchUsers();
    } catch (error) {
      message.error(
        error.message ||
          (isEditMode ? "Failed to update user" : "Failed to create user")
      );
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Delete User",
      content: "Are you sure you want to delete this user?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true);
          await api.delete(`/users/${userId}`);
          message.success("User deleted successfully");
          await fetchUsers();
        } catch (error) {
          message.error(error.message || "Failed to delete user");
          console.error("Delete error:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      width: "20%",
      render: (text) => text || "-",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "15%",
      render: (role) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "4px",
            backgroundColor:
              role === "owner"
                ? "#f6d365"
                : role === "manager"
                ? "#4facfe"
                : "#b3e5fc",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: "12%",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title={!canManageUsers ? "Manager role required" : ""}>
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditRole(record)}
              disabled={!canManageUsers}
            >
              Edit Role
            </Button>
          </Tooltip>
          <Tooltip title={!canDeleteUsers ? "Owner role required" : ""}>
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              disabled={!canDeleteUsers}
            >
              Delete
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="users-page-container">
      <Card
        title="Team Members"
        extra={
          <Tooltip title={!canManageUsers ? "Manager role required" : ""}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateClick}
              disabled={loading || !canManageUsers}
            >
              Add Team Member
            </Button>
          </Tooltip>
        }
      >
        <Spin spinning={loading}>
          {users.length === 0 ? (
            <Empty
              description="No team members found"
              style={{ marginTop: 50, marginBottom: 50 }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateClick}
              >
                Add your first team member
              </Button>
            </Empty>
          ) : (
            <div className="users-table-wrapper">
              <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
              />
            </div>
          )}
        </Spin>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit User Role" : "Add Team Member"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleModalCancel}
        okText={isEditMode ? "Update" : "Create"}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
          className="users-modal-form"
        >
          {!isEditMode && (
            <>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="user@example.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters",
                  },
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              <Form.Item label="Full Name (Optional)" name="full_name">
                <Input placeholder="John Doe" />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select
              placeholder="Select a role"
              options={[
                { label: "Owner", value: "owner" },
                { label: "Manager", value: "manager" },
                { label: "Staff", value: "staff" },
              ]}
            />
          </Form.Item>

          {!isEditMode && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f0f5ff",
                borderRadius: "4px",
                marginTop: "16px",
                fontSize: "12px",
                color: "#595959",
              }}
            >
              <strong>New user credentials:</strong>
              <div style={{ marginTop: "8px" }}>
                Users will receive their email and password. They can use these
                to login and then assign themselves to businesses.
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
