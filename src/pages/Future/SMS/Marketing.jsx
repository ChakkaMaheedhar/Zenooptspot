import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function SMSMarketing() {
  const { currentBranch } = useAuth();

  const campaignsData = [
    {
      key: "1",
      campaignName: "Summer Wash Deal",
      recipient: "All Members",
      sentDate: "2025-12-01",
      delivered: 3245,
      clicks: 892,
      conversionRate: "24.5%",
      status: "completed",
    },
    {
      key: "2",
      campaignName: "Weekend Special",
      recipient: "Inactive Members",
      sentDate: "2025-11-25",
      delivered: 1850,
      clicks: 310,
      conversionRate: "16.8%",
      status: "completed",
    },
    {
      key: "3",
      campaignName: "New Year Promo",
      recipient: "All",
      sentDate: "2025-12-02",
      delivered: 5000,
      clicks: 1200,
      conversionRate: "24.0%",
      status: "scheduled",
    },
  ];

  const columns = [
    { title: "Campaign Name", dataIndex: "campaignName", key: "campaignName" },
    { title: "Recipient", dataIndex: "recipient", key: "recipient" },
    { title: "Sent Date", dataIndex: "sentDate", key: "sentDate" },
    { title: "Delivered", dataIndex: "delivered", key: "delivered" },
    { title: "Clicks", dataIndex: "clicks", key: "clicks" },
    {
      title: "Conversion Rate",
      dataIndex: "conversionRate",
      key: "conversionRate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "completed" ? "success" : "processing"}
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
            title="Total Campaigns"
            value="145"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Total Delivered" value="125.3K" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg Click Rate" value="18.2%" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Active Campaigns" value="8" />
        </Col>
      </Row>

      <Card
        title={`SMS Marketing - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            New Campaign
          </Button>
        }
      >
        <Table
          dataSource={campaignsData}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  );
}
