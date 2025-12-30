import { Card, Form, Input, Button, Row, Col, Statistic, Space } from "antd";
import { CalculatorOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../../../context/useAuth";

export default function MACCalculator() {
  const { currentBranch } = useAuth();
  const [totalAcquisitionCost, setTotalAcquisitionCost] = useState(0);
  const [macValue, setMacValue] = useState(0);

  const handleCalculate = (values) => {
    const { totalMarketingSpend, customerServiceCost, newCustomers } = values;

    const total =
      parseFloat(totalMarketingSpend || 0) +
      parseFloat(customerServiceCost || 0);
    const mac = newCustomers > 0 ? total / newCustomers : 0;

    setTotalAcquisitionCost(total);
    setMacValue(mac.toFixed(2));
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="MAC Calculator">
            <Form onFinish={handleCalculate} layout="vertical">
              <Form.Item
                label="Total Marketing Spend ($)"
                name="totalMarketingSpend"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="0.00" />
              </Form.Item>

              <Form.Item
                label="Customer Service Cost ($)"
                name="customerServiceCost"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="0.00" />
              </Form.Item>

              <Form.Item
                label="New Customers Acquired"
                name="newCustomers"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="0" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                icon={<CalculatorOutlined />}
              >
                Calculate
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Results">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Statistic
                title="Total Acquisition Cost"
                value={totalAcquisitionCost}
                prefix="$"
                valueStyle={{ color: "#00523f" }}
              />
              <Statistic
                title="Member Acquisition Cost (MAC)"
                value={macValue}
                prefix="$"
                valueStyle={{
                  color: "#FFC42A",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              />
              <div style={{ fontSize: 12, color: "#666" }}>
                <p>
                  <strong>MAC</strong> is the average cost to acquire one new
                  customer.
                </p>
                <p>Formula: (Marketing Spend + Service Cost) / New Customers</p>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
