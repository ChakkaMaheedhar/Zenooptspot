import React, { useState } from "react";
import { Table, Input, Select, Space, Button, Tag } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import "./AllCoupons.css";

export default function AllCoupons() {
  const [coupons] = useState([
    {
      id: 1,
      couponName: "1 FREE $21 Diamond Car Wash",
      couponCode: "SPARKLECS1",
      type: "Free Wash",
      usage: "277 / 30000",
      accountType: "Master",
      lastIssued: "3 days ago",
      lastRedeemed: "3 days ago",
    },
    {
      id: 2,
      couponName: "Refer It Forward Qualifier",
      couponCode: "RFQ",
      type: "Qualifier",
      usage: "450 / 50000",
      accountType: "Master",
      lastIssued: "1 day ago",
      lastRedeemed: "2 days ago",
    },
    {
      id: 3,
      couponName: "1 FREE Carwash",
      couponCode: "SparklCarSPA",
      type: "Free Wash",
      usage: "116 / 30000",
      accountType: "Master",
      lastIssued: "5 days ago",
      lastRedeemed: "Never",
    },
  ]);

  const columns = [
    {
      title: "Coupon",
      key: "coupon",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: "4px" }}>
            {record.couponName}
          </div>
          <div style={{ fontSize: "12px", color: "#999" }}>
            {record.couponCode}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Usage",
      dataIndex: "usage",
      key: "usage",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: "Quick Stats",
      key: "stats",
      render: (_, record) => (
        <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
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
        <Button type="text" icon={<EyeOutlined />} size="small">
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="all-coupons-container">
      <div className="all-coupons-header">
        <div>
          <h2>All Coupons</h2>
          <p>View and manage all coupons across all accounts.</p>
        </div>
      </div>

      <div className="all-coupons-section">
        <div className="all-coupons-controls">
          <h3>Coupons</h3>
          <Space style={{ marginBottom: "16px" }}>
            <Input
              placeholder="Search coupons..."
              prefix={<SearchOutlined />}
              style={{ width: "250px" }}
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
                { label: "Most Used", value: "most-used" },
                { label: "Least Used", value: "least-used" },
              ]}
            />
          </Space>
        </div>

        <Table
          dataSource={coupons}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="all-coupons-table"
        />
      </div>
    </div>
  );
}
