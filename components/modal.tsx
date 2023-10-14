import React, { useState } from "react";
import { Button, DatePicker, Divider, Form, Input, Modal, Space } from "antd";
import { useUser } from "@auth0/nextjs-auth0/client";
import BodyMap from "./bodyMap";

interface EncircledArea {
  id: number;
  x: number;
  y: number;
  detail: string;
}

const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser();
  const [parentEncircledAreas, setParentEncircledAreas] = useState<
    EncircledArea[]
  >([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = (values: any) => {
    console.log("Success:", values, parentEncircledAreas);
  };

  function updateEncircledAreas(areas: EncircledArea[]): void {
    setParentEncircledAreas(areas);
  }

  return (
    <>
      <Modal
        title="Create Report"
        centered
        open={isOpen}
        maskClosable={false}
        width={1000}
        onCancel={onClose}
        footer={null}
      >
        <Divider />
        <Form {...layout} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="datetime" label="Date/Time">
            <DatePicker showTime />
          </Form.Item>
          <Divider />
          <BodyMap onUpdateEncircledAreas={updateEncircledAreas} />
          <Divider />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ float: "right" }}>
              <Button danger onClick={onClose} size="large" style={{ padding: "0 40px" }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ padding: "0 40px" }}
              >
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReportModal;
