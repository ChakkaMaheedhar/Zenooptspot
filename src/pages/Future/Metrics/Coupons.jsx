import React, { useState } from "react";
import { Table, Input, Select, Space, Button, Tag } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import "./Coupons.css";

export default function Coupons() {
  const [coupons] = useState([
    {
      id: 1,
      name: "[Richland Hills FREE $19 Diamond Car Wash] FREE $19 Diamond Car Wash",
      code: "1 FREE Carwash @ Sparkle Car SPA - Refer It Forward",
      type: "Free Wash",
      usage: "277 / 30000",
      accountType: "master",
      lastIssued: "3 days ago",
      lastRedeemed: "3 days ago",
    },
    {
      id: 2,
      name: "[Richland Hills 50% OFF $19 Diamond Car Wash] 50% OFF $19 Diamond Car Wash",
      code: "$5 OFF @ Sparkle Car SPA - Drip",
      type: "50% Off",
      usage: "10 / 30000",
      accountType: "master",
      lastIssued: "Never",
      lastRedeemed: "about 2 months ago",
    },
    {
      id: 3,
      name: "[Midlothian FREE $21 Diamond Car Wash] FREE $21 Diamond Car Wash",
      code: "1 FREE $21 Diamond Car Wash @ Sparkle Car SPA - SPARKLECS1",
      type: "Free Wash",
      usage: "116 / 30000",
      accountType: "master",
      lastIssued: "Never",
      lastRedeemed: "Never",
    },
  ]);

  const columns = [
    {
      title: "Coupon",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: "8px" }}>
            {record.name}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            {record.code}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <span>{type}</span>,
    },
    {
      title: "Usage",
      dataIndex: "usage",
      key: "usage",
      render: (usage) => <span>{usage}</span>,
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
      render: (accountType) => <Tag>{accountType}</Tag>,
    },
    {
      title: "Quick Stats",
      key: "stats",
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div>
            Last issued: <strong>{record.lastIssued}</strong>
          </div>
          <div>
            Last redeemed: <strong>{record.lastRedeemed}</strong>
          </div>
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <Button type="primary" size="small">
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="coupons-container">
      <div className="coupons-header">
        <div>
          <h2>Coupons</h2>
          <p>All coupons for Sparkle Car SPA - Master locations.</p>
        </div>
      </div>

      <div className="coupons-performance">
        <div className="coupons-performance-header">
          <h2>Coupon Performance</h2>
          <Space>
            <Input
              placeholder="Search coupons..."
              prefix={<SearchOutlined />}
              style={{ width: "300px" }}
            />
            <Select
              placeholder="Status"
              style={{ width: "120px" }}
              options={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
              ]}
            />
            <Select
              placeholder="Sort"
              style={{ width: "120px" }}
              options={[
                { label: "Newest", value: "newest" },
                { label: "Oldest", value: "oldest" },
              ]}
            />
          </Space>
        </div>

        <Table
          dataSource={coupons}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="coupons-table"
        />
      </div>
    </div>
  );
}
