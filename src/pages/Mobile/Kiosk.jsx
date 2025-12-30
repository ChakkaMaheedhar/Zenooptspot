import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Kiosk.css";

export default function Kiosk() {
  const [kiosks, setKiosks] = useState([
    {
      id: 1,
      name: "sparklespa",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = (values) => {
    setKiosks([...kiosks, { ...values, id: Date.now() }]);
    setIsModalOpen(false);
    form.resetFields();
    message.success("Kiosk created successfully");
  };

  const handleManage = (kioskName) => {
    message.success(`Managing ${kioskName}`);
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <div>
          <h2>Available Kiosks</h2>
          <p>
            Here are your available kiosks and instructions to get them setup on
            your device.
          </p>
        </div>
      </div>

      <div className="kiosk-list">
        {kiosks.map((kiosk) => (
          <div key={kiosk.id} className="kiosk-item">
            <div className="kiosk-info">
              <h3>{kiosk.name}</h3>
            </div>
            <div className="kiosk-actions">
              <Button onClick={() => handleManage(kiosk.name)}>
                + Install on a different device
              </Button>
              <Button type="primary" onClick={() => handleManage(kiosk.name)}>
                + Install on this device
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Add New Kiosk"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Kiosk Name"
            rules={[{ required: true, message: "Enter kiosk name" }]}
          >
            <Input placeholder="e.g., sparklespa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
