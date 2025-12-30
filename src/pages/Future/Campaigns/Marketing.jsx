import React, { useState } from "react";
import { Card, Table, Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./Marketing.css";

export default function CampaignsMarketing() {
  const [campaigns] = useState([
    {
      id: 1,
      name: "SPARKLECSMeta1",
      description:
        "Bedford Hills FREE $19 Diamond Car Wash | FREE $19 Diamond Car Wash",
      date: "May 29, 2025 → Ongoing",
      status: "Active",
      code: "56506",
      codeLabel: "SPARKLECSMeta1",
      optins: 96,
      optinsChange: "+96 last 30 days",
      issued: 94,
      issuedChange: "+94 last 30 days",
      redeemed: 23,
      redeemedChange: "+23 last 30 days",
      conversion: "24.5% conversion",
    },
    {
      id: 2,
      name: "SPARKLECSMeta3",
      description:
        "Midlothian FREE $21 Diamond Car Wash | FREE $21 Diamond Car Wash",
      date: "Aug 19, 2025 → Ongoing",
      status: "Active",
      code: "56506",
      codeLabel: "SPARKLECSMeta3",
      optins: 79,
      optinsChange: "+79 last 30 days",
      issued: 72,
      issuedChange: "+72 last 30 days",
      redeemed: 10,
      redeemedChange: "+10 last 30 days",
      conversion: "13.9% conversion",
    },
    {
      id: 3,
      name: "SPARKLECSGoogle3",
      description:
        "Midlothian FREE $21 Diamond Car Wash | FREE $21 Diamond Car Wash",
      date: "Aug 19, 2025 → Ongoing",
      status: "Active",
      code: "56506",
      codeLabel: "SPARKLECSGoogle3",
      optins: 36,
      optinsChange: "+36 last 30 days",
      issued: 36,
      issuedChange: "+36 last 30 days",
      redeemed: 20,
      redeemedChange: "+20 last 30 days",
      conversion: "55.6% conversion",
    },
  ]);

  const columns = [
    {
      title: "Campaign Details",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <strong>{record.name}</strong>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            {record.description}
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            {record.date}
          </div>
        </div>
      ),
    },
    {
      title: "Code & Keyword",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <div>
          <div>{record.code}</div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            {record.codeLabel}
          </div>
        </div>
      ),
    },
    {
      title: "Keyword Opt-ins",
      dataIndex: "optins",
      key: "optins",
      render: (text, record) => (
        <div>
          <strong>{record.optins}</strong>
          <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px" }}>
            {record.optinsChange}
          </div>
        </div>
      ),
    },
    {
      title: "Coupons Issued",
      dataIndex: "issued",
      key: "issued",
      render: (text, record) => (
        <div>
          <strong>{record.issued}</strong>
          <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px" }}>
            {record.issuedChange}
          </div>
        </div>
      ),
    },
    {
      title: "Coupons Redeemed",
      dataIndex: "redeemed",
      key: "redeemed",
      render: (text, record) => (
        <div>
          <strong>{record.redeemed}</strong>
          <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px" }}>
            {record.redeemedChange}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="campaigns-container">
      <div className="campaigns-header">
        <div>
          <h1>Campaign Manager</h1>
          <p>Overview of all campaigns and their performance.</p>
        </div>

        <div className="campaigns-stats">
          <div className="stat-item">
            <div className="stat-value">39</div>
            <div className="stat-label">Total Campaigns</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">39</div>
            <div className="stat-label">Active Campaigns</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">346</div>
            <div className="stat-label">Coupons Issued</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">31.5%</div>
            <div className="stat-label">Conversion Rate</div>
          </div>
        </div>
      </div>

      <Card className="campaigns-performance">
        <div className="campaigns-performance-header">
          <h2>Campaign Performance</h2>
          <Space>
            <Input
              placeholder="Search campaigns..."
              prefix={<SearchOutlined />}
              style={{ width: "300px" }}
            />
            <Select
              placeholder="Status"
              style={{ width: "120px" }}
              options={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "active" },
                { label: "Paused", value: "paused" },
              ]}
            />
            <Select
              placeholder="Performance"
              style={{ width: "140px" }}
              options={[
                { label: "All Performance", value: "all" },
                { label: "High", value: "high" },
                { label: "Low", value: "low" },
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
          dataSource={campaigns}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="campaigns-table"
        />
      </Card>
    </div>
  );
}
