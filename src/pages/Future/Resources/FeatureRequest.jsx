import { Card, Form, Input, Button, Space, Select, Row, Col } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../../../context/useAuth";

export default function FeatureRequest() {
  const { currentBranch, user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (values) => {
    console.log("Feature request submitted:", values);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title={`Feature Request - ${currentBranch?.name || "All"}`}>
            {submitted && (
              <div
                style={{
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: "4px",
                  padding: "12px",
                  marginBottom: "16px",
                  color: "#52c41a",
                }}
              >
                ✓ Feature request submitted successfully!
              </div>
            )}

            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Feature Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter feature title" },
                ]}
              >
                <Input placeholder="Describe the feature in a few words" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="ui">User Interface</Select.Option>
                  <Select.Option value="integration">Integration</Select.Option>
                  <Select.Option value="reporting">Reporting</Select.Option>
                  <Select.Option value="automation">Automation</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please describe your feature request",
                  },
                ]}
              >
                <Input.TextArea
                  rows={5}
                  placeholder="Detailed description of the feature..."
                />
              </Form.Item>

              <Form.Item
                label="Priority"
                name="priority"
                rules={[{ required: true }]}
              >
                <Select placeholder="How important is this?">
                  <Select.Option value="low">Low</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="high">High</Select.Option>
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                icon={<SendOutlined />}
              >
                Submit Request
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Recent Requests">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div
                style={{
                  padding: "12px",
                  background: "#f0f9f7",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontWeight: 500 }}>Bulk Member Export</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: "4px" }}>
                  Priority: <strong>High</strong>
                </div>
              </div>
              <div
                style={{
                  padding: "12px",
                  background: "#f0f9f7",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontWeight: 500 }}>Mobile App for Staff</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: "4px" }}>
                  Priority: <strong>Medium</strong>
                </div>
              </div>
              <div
                style={{
                  padding: "12px",
                  background: "#f0f9f7",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontWeight: 500 }}>API Integration</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: "4px" }}>
                  Priority: <strong>High</strong>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
