import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./Ocard.css";

export default function Ocard() {
  const [ocards, setOcards] = useState([
    {
      id: 1,
      name: "56484",
      description: "Premium oCard for retail partners",
    },
    {
      id: 2,
      name: "sparklecarspaomobiletos",
      description: "Sparkle Car Spa oCard",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = (values) => {
    setOcards([...ocards, { ...values, id: Date.now() }]);
    setIsModalOpen(false);
    form.resetFields();
    message.success("oCard created successfully");
  };

  const handleInstallDevice = (ocardName, deviceType) => {
    message.success(`${ocardName} - ${deviceType} installation initiated`);
  };

  return (
    <div className="ocard-container">
      <div className="ocard-header">
        <div>
          <h2>Available oCard Apps</h2>
          <p>
            Here are your available oCard apps and instructions to get them
            setup on your device.
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Request a new oCard
        </Button>
      </div>

      <div className="ocard-list">
        {ocards.map((ocard) => (
          <div key={ocard.id} className="ocard-item">
            <div className="ocard-info">
              <h3>{ocard.name}</h3>
              <p>{ocard.description}</p>
            </div>
            <div className="ocard-actions">
              <Button
                onClick={() =>
                  handleInstallDevice(ocard.name, "different device")
                }
              >
                + Install on a different device
              </Button>
              <Button
                type="primary"
                onClick={() => handleInstallDevice(ocard.name, "this device")}
              >
                + Install on this device
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Request a new oCard"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="oCard Name"
            rules={[{ required: true, message: "Enter oCard name" }]}
          >
            <Input placeholder="e.g., 56484" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter description" }]}
          >
            <Input placeholder="e.g., Premium oCard for retail partners" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
