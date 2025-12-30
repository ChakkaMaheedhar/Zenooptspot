import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function LinkTracker() {
  const { currentBranch } = useAuth();

  const linksData = [
    {
      key: "1",
      shortURL: "zeno.co/summer2025",
      originalURL: "zenooptspot.com/summer-promotion-2025",
      clicks: 3450,
      lastClicked: "2025-12-02",
      status: "active",
    },
    {
      key: "2",
      shortURL: "zeno.co/promo15",
      originalURL: "zenooptspot.com/promo-15-percent",
      clicks: 2100,
      lastClicked: "2025-12-01",
      status: "active",
    },
    {
      key: "3",
      shortURL: "zeno.co/oldpromo",
      originalURL: "zenooptspot.com/old-campaign",
      clicks: 890,
      lastClicked: "2025-11-15",
      status: "inactive",
    },
  ];

  const columns = [
    { title: "Short URL", dataIndex: "shortURL", key: "shortURL" },
    { title: "Original URL", dataIndex: "originalURL", key: "originalURL" },
    { title: "Clicks", dataIndex: "clicks", key: "clicks" },
    { title: "Last Clicked", dataIndex: "lastClicked", key: "lastClicked" },
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
            title="Total Links"
            value="342"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Total Clicks" value="245.3K" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg Clicks/Link" value="717" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Active Links" value="298" />
        </Col>
      </Row>

      <Card
        title={`Link Tracker - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Create Link
          </Button>
        }
      >
        <Table dataSource={linksData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
