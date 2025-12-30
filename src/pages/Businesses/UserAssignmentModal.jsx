import { useState, useEffect } from "react";
import { Modal, Form, Select, Table, Button, message, Spin, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import api from "../../utils/api";

export default function UserAssignmentModal({
  isVisible,
  businessId,
  onClose,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [businessUsers, setBusinessUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all users in organization
        const usersResponse = await api.get("/organizations/");
        const orgs = Array.isArray(usersResponse)
          ? usersResponse
          : usersResponse.data || [];
        const org = orgs[0];
        setAllUsers(org?.admin_users || []);

        // Fetch users already assigned to this business
        const businessResponse = await api.get(`/businesses/${businessId}`);
        const businessData =
          businessResponse.business_users ||
          businessResponse.data?.business_users ||
          [];
        setBusinessUsers(businessData);
      } catch (e) {
        message.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchData();
    }
  }, [isVisible, businessId]);

  const getAvailableUsers = () => {
    const assignedUserIds = businessUsers.map((bu) => bu.admin_user_id);
    return allUsers.filter((user) => !assignedUserIds.includes(user.id));
  };

  const handleAssignUser = async (values) => {
    try {
      setLoading(true);
      await api.post(`/businesses/${businessId}/assign-user`, {
        admin_user_id: values.user_id,
        role: values.role,
      });
      message.success("User assigned successfully");
      form.resetFields();
      // Refetch data
      const businessResponse = await api.get(`/businesses/${businessId}`);
      const businessData =
        businessResponse.business_users ||
        businessResponse.data?.business_users ||
        [];
      setBusinessUsers(businessData);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to assign user");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (businessUserId) => {
    Modal.confirm({
      title: "Remove User",
      content: "Are you sure you want to remove this user from the business?",
      okText: "Remove",
      okType: "danger",
      onOk: async () => {
        try {
          await api.delete(`/businesses/users/${businessUserId}`);
          message.success("User removed successfully");
          // Refetch data
          const businessResponse = await api.get(`/businesses/${businessId}`);
          const businessData =
            businessResponse.business_users ||
            businessResponse.data?.business_users ||
            [];
          setBusinessUsers(businessData);
        } catch {
          message.error("Failed to remove user");
        }
      },
    });
  };

  const columns = [
    {
      title: "Email",
      dataIndex: ["admin_user", "email"],
      key: "email",
      width: "40%",
    },
    {
      title: "Name",
      dataIndex: ["admin_user", "full_name"],
      key: "full_name",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveUser(record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="Manage Business Users"
      open={isVisible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <div style={{ marginBottom: "30px" }}>
          <h3>Assign New User</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAssignUser}
            style={{ marginBottom: "20px" }}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <Form.Item
                label="Select User"
                name="user_id"
                style={{ flex: 1, marginBottom: 0 }}
                rules={[{ required: true, message: "Please select a user" }]}
              >
                <Select placeholder="Choose a user to assign">
                  {getAvailableUsers().map((user) => (
                    <Select.Option key={user.id} value={user.id}>
                      {user.email} - {user.full_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                style={{ flex: 1, marginBottom: 0 }}
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select placeholder="Select role">
                  <Select.Option value="owner">Owner</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="staff">Staff</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label=" " style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit">
                  Assign
                </Button>
              </Form.Item>
            </div>
          </Form>

          <h3>Assigned Users</h3>
          {businessUsers.length === 0 ? (
            <Empty description="No users assigned to this business" />
          ) : (
            <Table
              dataSource={businessUsers}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          )}
        </div>
      </Spin>
    </Modal>
  );
}
