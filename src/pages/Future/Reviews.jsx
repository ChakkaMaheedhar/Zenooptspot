import {
  Card,
  Table,
  Button,
  Space,
  Badge,
  Tabs,
  Row,
  Col,
  Statistic,
  Rate,
} from "antd";
import { MessageOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/useAuth";

export default function Reviews() {
  const { currentBranch } = useAuth();

  const reviewsData = [
    {
      key: "1",
      reviewer: "John Smith",
      rating: 5,
      date: "2025-12-02",
      comment: "Amazing service! Will definitely come back.",
      platform: "Google",
      status: "published",
    },
    {
      key: "2",
      reviewer: "Emma Wilson",
      rating: 4,
      date: "2025-12-01",
      comment: "Good quality wash, could be faster.",
      platform: "Yelp",
      status: "published",
    },
    {
      key: "3",
      reviewer: "Michael Chen",
      rating: 3,
      date: "2025-11-30",
      comment: "Average experience, pricing is high.",
      platform: "Google",
      status: "pending-response",
    },
  ];

  const columns = [
    { title: "Reviewer", dataIndex: "reviewer", key: "reviewer" },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    { title: "Platform", dataIndex: "platform", key: "platform" },
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
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space size="small">
          <Button type="text" size="small" icon={<MessageOutlined />}>
            Reply
          </Button>
          <Button type="text" danger size="small" icon={<DeleteOutlined />} />
        </Space>
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

      <Card title={`Reviews - ${currentBranch?.name || "All Branches"}`}>
        <Tabs
          items={[
            {
              key: "all",
              label: "All Reviews",
              children: (
                <Table
                  dataSource={reviewsData}
                  columns={columns}
                  pagination={false}
                />
              ),
            },
            {
              key: "5-star",
              label: "5 Stars",
              children: (
                <Table
                  dataSource={reviewsData.filter((r) => r.rating === 5)}
                  columns={columns}
                  pagination={false}
                />
              ),
            },
            {
              key: "pending",
              label: "Pending Response",
              children: (
                <Table
                  dataSource={reviewsData.filter(
                    (r) => r.status === "pending-response"
                  )}
                  columns={columns}
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
