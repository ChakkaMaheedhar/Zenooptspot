import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Card,
  Empty,
  Spin,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import api from "../../utils/api";
import UserAssignmentModal from "./UserAssignmentModal";
import AssignTeamMembersModal from "./AssignTeamMembersModal";
import { useAuth } from "../../context/useAuth";
import {
  canEditBusiness,
  canDeleteBusiness,
  canManageTeam,
  getUserBusinessRole,
} from "../../utils/permissions";
import "./BusinessPage.css";

export default function BusinessPage() {
  const { user } = useAuth(); // user.role = ORGANIZATION-level role
  const [businesses, setBusinesses] = useState([]);
  const [businessUsers, setBusinessUsers] = useState({}); // Track users assigned to each business
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [userAssignmentVisible, setUserAssignmentVisible] = useState(false);
  const [assignTeamMembersVisible, setAssignTeamMembersVisible] =
    useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [form] = Form.useForm();

  // Fetch businesses on component mount
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching businesses - GET /businesses/");
      const response = await api.get("/businesses/");
      console.log("📦 Got response:", response);
      const businesses = Array.isArray(response)
        ? response
        : response.data || [];
      setBusinesses(businesses);

      // Fetch users for each business to check roles
      const usersMap = {};
      for (const business of businesses) {
        try {
          const users = await api.get(`/businesses/${business.id}/users/`);
          usersMap[business.id] = Array.isArray(users)
            ? users
            : users.data || [];
        } catch (err) {
          console.warn(`Failed to fetch users for business ${business.id}`);
          usersMap[business.id] = [];
        }
      }
      setBusinessUsers(usersMap);
    } catch (error) {
      message.error("Failed to fetch businesses");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setIsEditMode(false);
    setEditingBusiness(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditClick = (business) => {
    setIsEditMode(true);
    setEditingBusiness(business);
    form.setFieldsValue({
      name: business.name,
      address: business.address || "",
      industry_type: business.industry_type || "",
      logo_url: business.logo_url || "",
    });
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingBusiness(null);
    form.resetFields();
  };

  const handleModalOk = async (values) => {
    try {
      setLoading(true);
      console.log("🔵 Starting to create/update business...");

      if (isEditMode) {
        // Update business
        console.log(
          "🟡 EDIT MODE - Calling PUT /businesses/",
          editingBusiness.id
        );
        await api.put(`/businesses/${editingBusiness.id}`, values);
        message.success("Business updated successfully");
      } else {
        // Create business
        console.log("🟢 CREATE MODE - Calling POST /businesses/");
        console.log("   Payload:", values);
        await api.post("/businesses/", values);
        message.success("Business created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();

      console.log("🟠 Refreshing business list - Calling GET /businesses/");
      await fetchBusinesses();
      console.log("✅ Done!");
    } catch (error) {
      message.error(error.response?.data?.detail || "Failed to save business");
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (businessId) => {
    Modal.confirm({
      title: "Delete Business",
      content: "Are you sure you want to delete this business?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true);
          await api.delete(`/businesses/${businessId}`);
          message.success("Business deleted successfully");
          await fetchBusinesses();
        } catch (error) {
          message.error("Failed to delete business");
          console.error("Delete error:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleManageUsers = (businessId) => {
    setSelectedBusinessId(businessId);
    setUserAssignmentVisible(true);
  };

  const handleAssignTeamMembers = (business) => {
    console.log("Clicked Team button for business:", business);
    setSelectedBusiness(business);
    setAssignTeamMembersVisible(true);
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "25%",
      render: (text) => text || "-",
    },
    {
      title: "Industry",
      dataIndex: "industry_type",
      key: "industry_type",
      width: "15%",
      render: (text) => text || "-",
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
      width: "25%",
      render: (_, record) => {
        // Get the users assigned to THIS SPECIFIC business
        const businessUsersList = businessUsers[record.id] || [];

        // Get current user's BUSINESS-LEVEL role in THIS business
        // (not their organization role - that's checked elsewhere for menu visibility)
        const userRole = getUserBusinessRole(businessUsersList, user?.id);

        // Check BUSINESS-level permissions based on role in THIS business
        const canEdit = canEditBusiness(userRole); // Need Manager or Owner
        const canDelete = canDeleteBusiness(userRole); // Need Owner only

        return (
          <Space size="small" wrap>
            {/* Team button always available - opens modal to show/manage team */}
            <Button
              type="primary"
              size="small"
              icon={<TeamOutlined />}
              onClick={() => handleAssignTeamMembers(record)}
            >
              Team
            </Button>
            {/* Customers always accessible */}
            <Button
              type="default"
              size="small"
              icon={<UserOutlined />}
              onClick={() => handleManageUsers(record.id)}
            >
              Customers
            </Button>
            {/* Edit requires Manager role in THIS business */}
            <Tooltip title={!canEdit ? "Manager role required" : ""}>
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record)}
                disabled={!canEdit}
              >
                Edit
              </Button>
            </Tooltip>
            {/* Delete requires Owner role in THIS business */}
            <Tooltip title={!canDelete ? "Owner role required" : ""}>
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                disabled={!canDelete}
              >
                Delete
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="business-page-container">
      <Card
        title="Business Management"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            disabled={loading}
          >
            Create Business
          </Button>
        }
      >
        <Spin spinning={loading}>
          {businesses.length === 0 ? (
            <Empty
              description={
                user?.role === "owner"
                  ? "No businesses found"
                  : "You don't have access to any businesses yet"
              }
              style={{ marginTop: 50, marginBottom: 50 }}
            >
              {user?.role === "owner" ? (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateClick}
                >
                  Create your first business
                </Button>
              ) : (
                <p style={{ color: "#666", marginTop: "16px" }}>
                  Ask an organization owner to assign you to a business.
                </p>
              )}
            </Empty>
          ) : (
            <div className="business-table-wrapper">
              <Table
                columns={columns}
                dataSource={businesses}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
              />
            </div>
          )}
        </Spin>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? "Edit Business" : "Create Business"}
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
          className="business-modal-form"
        >
          <Form.Item
            label="Business Name"
            name="name"
            rules={[{ required: true, message: "Business name is required" }]}
          >
            <Input placeholder="Enter business name" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input placeholder="Enter business address" />
          </Form.Item>

          <Form.Item label="Industry Type" name="industry_type">
            <Input placeholder="e.g., Retail, Food Service, etc." />
          </Form.Item>

          <Form.Item label="Logo URL" name="logo_url">
            <Input placeholder="https://example.com/logo.png" />
          </Form.Item>
        </Form>
      </Modal>

      {/* User Assignment Modal */}
      {selectedBusinessId && (
        <UserAssignmentModal
          isVisible={userAssignmentVisible}
          businessId={selectedBusinessId}
          onClose={() => {
            setUserAssignmentVisible(false);
            fetchBusinesses(); // Refresh after user assignment changes
          }}
        />
      )}

      {/* Assign Team Members Modal */}
      <AssignTeamMembersModal
        visible={assignTeamMembersVisible}
        business={selectedBusiness}
        onClose={() => {
          setAssignTeamMembersVisible(false);
          setSelectedBusiness(null);
          fetchBusinesses();
        }}
        onAssignSuccess={() => {
          fetchBusinesses();
        }}
      />
    </div>
  );
}
