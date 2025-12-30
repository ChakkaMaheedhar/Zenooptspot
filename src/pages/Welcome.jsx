import { Card, Button, Row, Col, Badge } from "antd";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 0 }}>
      {/* Header Section */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{ margin: 0, color: "#00523f", fontSize: 36, fontWeight: 700 }}
        >
          Welcome to Your OptSpot Hub!
        </h1>
        <p style={{ margin: "12px 0 0 0", color: "#666", fontSize: 16 }}>
          We're glad you're here. Watch the video below to learn how to navigate
          the hub.
        </p>
      </div>

      {/* Hub Section */}
      <div style={{ marginBottom: 32 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Badge
              count="1"
              style={{
                backgroundColor: "#e6f4ff",
                color: "#1677dd",
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 600,
              }}
            />
          </Col>
          <Col>
            <h3
              style={{
                margin: 0,
                color: "#1677dd",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Hub
            </h3>
            <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: 14 }}>
              Step details below
            </p>
          </Col>
        </Row>
      </div>

      {/* Video Section */}
      <Card
        style={{
          marginBottom: 32,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #f0f0f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            width: "100%",
            background: "#000",
            borderRadius: "8px 8px 0 0",
            overflow: "hidden",
            aspectRatio: "16 / 9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
            title="Intro: The Hub"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ minHeight: "500px" }}
          />
        </div>
        <div style={{ padding: "16px 24px", background: "#fff" }}>
          <h3
            style={{ margin: 0, color: "#000", fontSize: 18, fontWeight: 600 }}
          >
            Intro: The Hub
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "#999", fontSize: 14 }}>
            👁 818 views
          </p>
        </div>
      </Card>

      {/* Complete Onboarding Button */}
      <div style={{ textAlign: "right", marginTop: 32 }}>
        <Button
          type="primary"
          size="large"
          style={{
            background: "#1677dd",
            borderColor: "#1677dd",
            fontSize: 16,
            height: 44,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          Complete Onboarding
        </Button>
      </div>
    </div>
  );
}
