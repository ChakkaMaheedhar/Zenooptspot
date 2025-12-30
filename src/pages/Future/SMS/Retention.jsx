import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function SMSRetention() {
  const { currentBranch } = useAuth();

  const retentionData = [
    {
      key: "1",
      segmentName: "Low Activity Members",
      size: 834,
      lastMessage: "2025-12-01",
      openRate: "42.3%",
      responseRate: "12.8%",
      status: "active",
    },
    {
      key: "2",
      segmentName: "3+ Month Inactive",
      size: 1256,
      lastMessage: "2025-11-28",
      openRate: "38.9%",
      responseRate: "9.4%",
      status: "active",
    },
    {
      key: "3",
      segmentName: "VIP Members",
      size: 456,
      lastMessage: "2025-12-02",
      openRate: "68.5%",
      responseRate: "31.2%",
      status: "active",
    },
  ];

  const columns = [
    { title: "Segment Name", dataIndex: "segmentName", key: "segmentName" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Last Message", dataIndex: "lastMessage", key: "lastMessage" },
    { title: "Open Rate", dataIndex: "openRate", key: "openRate" },
    { title: "Response Rate", dataIndex: "responseRate", key: "responseRate" },
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
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Retention Rate"
            value="78.4%"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Active Segments" value="12" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Target Members" value="23.4K" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg Response Rate" value="17.8%" />
        </Col>
      </Row>

      <Card
        title={`SMS Retention - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            New Segment
          </Button>
        }
      >
        <Table
          dataSource={retentionData}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  );
}
