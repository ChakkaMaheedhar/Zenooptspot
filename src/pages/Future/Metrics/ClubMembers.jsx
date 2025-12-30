import { Card, Table, Button, Space, Badge, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/useAuth";

export default function ClubMembers() {
  const { currentBranch } = useAuth();

  const membersData = [
    {
      key: "1",
      memberID: "M-0001",
      name: "John Smith",
      email: "john.smith@email.com",
      joinDate: "2024-01-15",
      visits: 34,
      status: "active",
    },
    {
      key: "2",
      memberID: "M-0002",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      joinDate: "2024-02-20",
      visits: 28,
      status: "active",
    },
    {
      key: "3",
      memberID: "M-0003",
      name: "Michael Brown",
      email: "m.brown@email.com",
      joinDate: "2023-11-10",
      visits: 52,
      status: "active",
    },
  ];

  const columns = [
    { title: "Member ID", dataIndex: "memberID", key: "memberID" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Join Date", dataIndex: "joinDate", key: "joinDate" },
    { title: "Visits", dataIndex: "visits", key: "visits" },
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
            title="Total Members"
            value="8,432"
            valueStyle={{ color: "#00523f" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Active Members" value="7,245" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="New This Month" value="342" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Churn Rate" value="2.3%" />
        </Col>
      </Row>

      <Card
        title={`Club Members - ${currentBranch?.name || "All Branches"}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Add Member
          </Button>
        }
      >
        <Table dataSource={membersData} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
