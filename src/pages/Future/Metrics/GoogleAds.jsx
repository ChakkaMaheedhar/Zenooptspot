import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function GoogleAds() {
  const { currentBranch } = useAuth();

  const adsData = [
    {
      key: "1",
      campaignName: "Local Search - Downtown",
      budget: "$400",
      spent: "$289.30",
      impressions: 52000,
      clicks: 3100,
      ctr: "5.96%",
      status: "active",
    },
    {
      key: "2",
      campaignName: "Local Search - Airport",
      budget: "$350",
      spent: "$240.80",
      impressions: 38000,
      clicks: 2200,
      ctr: "5.79%",
      status: "active",
    },
  ];

  const columns = [
    { title: "Campaign Name", dataIndex: "campaignName", key: "campaignName" },
    { title: "Budget", dataIndex: "budget", key: "budget" },
    { title: "Spent", dataIndex: "spent", key: "spent" },
    { title: "Impressions", dataIndex: "impressions", key: "impressions" },
    { title: "Clicks", dataIndex: "clicks", key: "clicks" },
    { title: "CTR", dataIndex: "ctr", key: "ctr" },
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
            title="Total Budget"
            value="$750"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Spent"
            value="$530.10"
            valueStyle={{ color: "#FFC42A" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Total Impressions" value="90K" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg CTR" value="5.88%" />
        </Col>
      </Row>

      <Card
        title={`Google Ads - ${currentBranch?.name || "All Branches"}`}
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
