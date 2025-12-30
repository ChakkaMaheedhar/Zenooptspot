import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { LineChartOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function MetaAds() {
  const { currentBranch } = useAuth();

  const adsData = [
    {
      key: "1",
      campaignName: "Summer Promo 2025",
      budget: "$500",
      spent: "$342.50",
      impressions: 45000,
      clicks: 2300,
      status: "active",
    },
    {
      key: "2",
      campaignName: "Brand Awareness",
      budget: "$300",
      spent: "$185.20",
      impressions: 28000,
      clicks: 1240,
      status: "active",
    },
  ];

  const columns = [
    { title: "Campaign Name", dataIndex: "campaignName", key: "campaignName" },
    { title: "Budget", dataIndex: "budget", key: "budget" },
    { title: "Spent", dataIndex: "spent", key: "spent" },
    { title: "Impressions", dataIndex: "impressions", key: "impressions" },
    { title: "Clicks", dataIndex: "clicks", key: "clicks" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "active" ? "success" : "default"}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Budget"
            value="$800"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Spent"
            value="$527.70"
            valueStyle={{ color: "#FFC42A" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Total Impressions" value="73K" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Total Clicks" value="3.5K" />
        </Col>
      </Row>

      <Card
        title={`Meta Ads - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            New Campaign
          </Button>
        }
      >
        <Table dataSource={adsData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
