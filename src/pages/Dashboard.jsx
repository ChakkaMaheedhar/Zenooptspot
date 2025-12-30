import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Space,
  Button,
  Alert,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/useAuth";
import { getVisibility } from "../utils/roleVisibility";

export default function Dashboard() {
  const { currentBranch, user } = useAuth();
  const visibility = getVisibility(user?.role);

  // Mock data - would come from API in real app
  const dashboardStats = {
    totalMembers: 8432,
    membersGrowth: 12.5,
    totalRevenue: 125400,
    revenueGrowth: 8.3,
    avgRating: 4.6,
    ratingGrowth: 0.3,
    thisMonthServices: 2847,
    servicesGrowth: -2.1,
  };

  const recentTransactions = [
    {
      key: "1",
      id: "TXN-001",
      date: "2025-12-02",
      customer: "John Smith",
      service: "Premium Wash",
      amount: "$45.00",
      status: "completed",
    },
    {
      key: "2",
      id: "TXN-002",
      date: "2025-12-02",
      customer: "Sarah Johnson",
      service: "Detail Service",
      amount: "$89.99",
      status: "completed",
    },
    {
      key: "3",
      id: "TXN-003",
      date: "2025-12-01",
      customer: "Mike Brown",
      service: "Standard Wash",
      amount: "$25.00",
      status: "completed",
    },
  ];

  const columns = [
    { title: "Transaction ID", dataIndex: "id", key: "id" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "#00523f" }}>Welcome, {user?.email}</h1>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          {currentBranch ? `${currentBranch.name} Branch` : "All Branches"}
        </p>
      </div>

      {/* Role-based alert for staff */}
      {user?.role === "staff" && (
        <Alert
          message="Staff View - Limited to Reviews Only"
          type="info"
          style={{ marginBottom: 24 }}
          showIcon
        />
      )}

      {/* Key Metrics - Show to all except staff */}
      {visibility.viewAnalytics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Members"
                value={dashboardStats.totalMembers}
                prefix={<TeamOutlined />}
                suffix={
                  <span style={{ color: "#52c41a" }}>
                    <ArrowUpOutlined /> {dashboardStats.membersGrowth}%
                  </span>
                }
                valueStyle={{ color: "#00523f" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={dashboardStats.totalRevenue}
                prefix={<DollarOutlined />}
                suffix={
                  <span style={{ color: "#52c41a" }}>
                    <ArrowUpOutlined /> {dashboardStats.revenueGrowth}%
                  </span>
                }
                valueStyle={{ color: "#FFC42A" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg Rating"
                value={dashboardStats.avgRating}
                suffix={
                  <span style={{ color: "#52c41a" }}>
                    <ArrowUpOutlined /> {dashboardStats.ratingGrowth}%
                  </span>
                }
                valueStyle={{ color: "#FFC42A" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Services This Month"
                value={dashboardStats.thisMonthServices}
                prefix={<ShoppingCartOutlined />}
                suffix={
                  <span
                    style={{
                      color:
                        dashboardStats.servicesGrowth < 0
                          ? "#ff4d4f"
                          : "#52c41a",
                    }}
                  >
                    {dashboardStats.servicesGrowth < 0 ? (
                      <ArrowDownOutlined />
                    ) : (
                      <ArrowUpOutlined />
                    )}{" "}
                    {Math.abs(dashboardStats.servicesGrowth)}%
                  </span>
                }
                valueStyle={{ color: "#00523f" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Performance Overview - Show to all except staff */}
      {visibility.viewAnalytics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title="Branch Performance" style={{ height: "100%" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#666" }}>
                      Member Retention
                    </span>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>78.4%</div>
                  </div>
                  <Progress percent={78.4} strokeColor="#00523f" />
                </div>
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#666" }}>
                      Service Completion Rate
                    </span>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>94.2%</div>
                  </div>
                  <Progress percent={94.2} strokeColor="#FFC42A" />
                </div>
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#666" }}>
                      Customer Satisfaction
                    </span>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>92.7%</div>
                  </div>
                  <Progress percent={92.7} strokeColor="#52c41a" />
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Quick Actions" style={{ height: "100%" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button block type="primary">
                  Add New Member
                </Button>
                <Button block>Create Marketing Campaign</Button>
                <Button block>View Reports</Button>
                <Button block>Manage Staff</Button>
                <Button block>Branch Settings</Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Recent Transactions - Owner/Manager only */}
      {visibility.viewFinancials && (
        <Card title="Recent Transactions" style={{ marginBottom: 24 }}>
          <Table
            dataSource={recentTransactions}
            columns={columns}
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* Revenue Breakdown - Owner/Manager only */}
      {visibility.viewRevenue && (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card title="Service Types Revenue">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span>Standard Wash</span>
                    <span style={{ fontWeight: 600 }}>$34,500 (27.5%)</span>
                  </div>
                  <Progress percent={27.5} strokeColor="#00523f" />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span>Premium Wash</span>
                    <span style={{ fontWeight: 600 }}>$45,200 (36.0%)</span>
                  </div>
                  <Progress percent={36} strokeColor="#FFC42A" />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span>Detail Service</span>
                    <span style={{ fontWeight: 600 }}>$32,800 (26.1%)</span>
                  </div>
                  <Progress percent={26.1} strokeColor="#52c41a" />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span>Membership Fees</span>
                    <span style={{ fontWeight: 600 }}>$12,900 (10.3%)</span>
                  </div>
                  <Progress percent={10.3} strokeColor="#faad14" />
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Top Performing Days">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div
                  style={{
                    padding: 12,
                    background: "#f0f9f7",
                    borderRadius: 4,
                    borderLeft: "4px solid #FFC42A",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Saturday</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    Average Revenue: $8,450 | Services: 234
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: "#f0f9f7",
                    borderRadius: 4,
                    borderLeft: "4px solid #00523f",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Sunday</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    Average Revenue: $7,890 | Services: 198
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: "#f0f9f7",
                    borderRadius: 4,
                    borderLeft: "4px solid #52c41a",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Friday</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    Average Revenue: $6,720 | Services: 167
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
