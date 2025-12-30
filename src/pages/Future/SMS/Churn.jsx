import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function SMSChurn() {
  const { currentBranch } = useAuth();

  const churnData = [
    {
      key: "1",
      memberID: "M-0456",
      name: "Robert Miller",
      churnRisk: "high",
      lastVisit: "2025-10-15",
      visitFrequency: "1.2 per month",
      status: "at-risk",
    },
    {
      key: "2",
      memberID: "M-0789",
      name: "Jessica Lee",
      churnRisk: "medium",
      lastVisit: "2025-11-02",
      visitFrequency: "2.1 per month",
      status: "at-risk",
    },
    {
      key: "3",
      memberID: "M-0234",
      name: "Thomas Brown",
      churnRisk: "low",
      lastVisit: "2025-11-28",
      visitFrequency: "4.5 per month",
      status: "low-risk",
    },
  ];

  const columns = [
    { title: "Member ID", dataIndex: "memberID", key: "memberID" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Churn Risk", dataIndex: "churnRisk", key: "churnRisk" },
    { title: "Last Visit", dataIndex: "lastVisit", key: "lastVisit" },
    {
      title: "Visit Frequency",
      dataIndex: "visitFrequency",
      key: "visitFrequency",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "at-risk" ? "error" : "success"}
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
            title="At-Risk Members"
            value="342"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="High Risk" value="87" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Prevented This Month" value="23" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Avg Months Active" value="14.3" />
        </Col>
      </Row>

      <Card
        title={`Churn Prevention - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Send Retention SMS
          </Button>
        }
      >
        <Table dataSource={churnData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
