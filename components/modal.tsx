import React, { useState } from "react";
import { Button, DatePicker, Divider, Form, Input, Modal } from "antd";
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
        footer={[
          <Button key="cancel" onClick={onClose} danger>
            Cancel
          </Button>,
          <Button key="save" onClick={onClose} type="primary">
            Save
          </Button>,
        ]}
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Divider />
      </Modal>
    </>
  );
};

export default ReportModal;
