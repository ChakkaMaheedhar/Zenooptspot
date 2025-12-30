import { Card, Table, Button, Space, Badge, Row, Col } from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function Forms() {
  const { currentBranch } = useAuth();

  const formsData = [
    {
      key: "1",
      formName: "Customer Feedback Survey",
      type: "survey",
      created: "2025-10-15",
      responses: 342,
      status: "active",
    },
    {
      key: "2",
      formName: "New Member Signup",
      type: "signup",
      created: "2025-08-20",
      responses: 1250,
      status: "active",
    },
    {
      key: "3",
      formName: "Service Inquiry Form",
      type: "inquiry",
      created: "2025-09-10",
      responses: 156,
      status: "active",
    },
  ];

  const columns = [
    { title: "Form Name", dataIndex: "formName", key: "formName" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Created", dataIndex: "created", key: "created" },
    { title: "Responses", dataIndex: "responses", key: "responses" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "active" ? "success" : "default"}
          text={status}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<DownloadOutlined />} size="small" />
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={`Forms - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<DownloadOutlined />}>
            New Form
          </Button>
        }
      >
        <Table dataSource={formsData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
