import { Card, Table, Button, Space, Tag, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function Keywords() {
  const { currentBranch } = useAuth();

  const keywordsData = [
    {
      key: "1",
      keyword: "car wash near me",
      campaign: "Local Search",
      searchVolume: 4500,
      avgCPC: "$0.45",
      impressions: 8900,
      status: "high-performing",
    },
    {
      key: "2",
      keyword: "best car wash downtown",
      campaign: "Local Search",
      searchVolume: 2300,
      avgCPC: "$0.52",
      impressions: 3200,
      status: "good",
    },
    {
      key: "3",
      keyword: "eco friendly car wash",
      campaign: "Brand",
      searchVolume: 1200,
      avgCPC: "$0.38",
      impressions: 890,
      status: "low",
    },
  ];

  const columns = [
    { title: "Keyword", dataIndex: "keyword", key: "keyword" },
    { title: "Campaign", dataIndex: "campaign", key: "campaign" },
    { title: "Search Volume", dataIndex: "searchVolume", key: "searchVolume" },
    { title: "Avg CPC", dataIndex: "avgCPC", key: "avgCPC" },
    { title: "Impressions", dataIndex: "impressions", key: "impressions" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "high-performing"
              ? "green"
              : status === "good"
              ? "blue"
              : "orange"
          }
        >
          {status.replace("-", " ")}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Keywords"
            value="2,847"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg Search Volume" value="8.2K" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Total Impressions" value="12.5K" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg CPC" value="$0.45" />
        </Col>
      </Row>

      <Card
        title={`Keywords - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Add Keyword
          </Button>
        }
      >
        <Table dataSource={keywordsData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
