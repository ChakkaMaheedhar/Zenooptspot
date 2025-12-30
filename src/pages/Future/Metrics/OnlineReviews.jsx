import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function OnlineReviews() {
  const { currentBranch } = useAuth();

  const reviewsData = [
    {
      key: "1",
      reviewer: "Alex Rodriguez",
      rating: 5,
      platform: "Google",
      date: "2025-12-02",
      comment: "Amazing service! Staff was very friendly.",
      status: "published",
    },
    {
      key: "2",
      reviewer: "Emma Wilson",
      rating: 4,
      platform: "Yelp",
      date: "2025-11-30",
      comment: "Good quality wash, a bit pricey.",
      status: "published",
    },
    {
      key: "3",
      reviewer: "David Chen",
      rating: 3,
      platform: "Google",
      date: "2025-11-28",
      comment: "Average service, wait time was long.",
      status: "pending-response",
    },
  ];

  const columns = [
    { title: "Reviewer", dataIndex: "reviewer", key: "reviewer" },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => `⭐ ${rating}/5`,
    },
    { title: "Platform", dataIndex: "platform", key: "platform" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "published" ? "success" : "warning"}
          text={status.replace("-", " ")}
        />
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Reviews"
            value="1,234"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg Rating" value="4.6/5" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="This Month" value="142" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Pending Response" value="8" />
        </Col>
      </Row>

      <Card title={`Online Reviews - ${currentBranch?.name || "All Branches"}`}>
        <Table dataSource={reviewsData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
