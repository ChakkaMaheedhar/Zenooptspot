import { Card, Space, Button, Row, Col, Empty } from "antd";
import { PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function Podcast() {
  const { currentBranch } = useAuth();

  const episodes = [
    {
      id: 1,
      title: "Building a Successful Car Wash Business",
      duration: "45:32",
      date: "2025-12-01",
      host: "John Anderson",
    },
    {
      id: 2,
      title: "Customer Retention Strategies",
      duration: "38:15",
      date: "2025-11-24",
      host: "Sarah Martinez",
    },
    {
      id: 3,
      title: "Digital Marketing for Car Services",
      duration: "41:20",
      date: "2025-11-17",
      host: "Mike Thompson",
    },
  ];

  return (
    <div>
      <Card
        title={`Cheers to Freedom Podcast - ${
          currentBranch?.name || "All Branches"
        }`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Subscribe
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {episodes.map((episode) => (
            <Card
              key={episode.id}
              hoverable
              style={{
                background: "#f0f9f7",
                border: "1px solid #ccebe5",
              }}
            >
              <Row gutter={16} align="middle">
                <Col>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<PlayCircleOutlined />}
                    size="large"
                  />
                </Col>
                <Col flex="auto">
                  <div>
                    <h3 style={{ margin: 0, color: "#00523f" }}>
                      {episode.title}
                    </h3>
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        color: "#666",
                        fontSize: 12,
                      }}
                    >
                      {episode.host} • {episode.duration} • {episode.date}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      </Card>
    </div>
  );
}
