import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Space,
  message,
} from "antd";
import { useUser } from "@auth0/nextjs-auth0/client";
import BodyMap from "./bodyMap";

interface EncircledArea {
  id: number;
  label: number;
  x: number;
  y: number;
  injuryDescription: string;
}

const CreateReportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser();
  const [EncircledAreas, setEncircledAreas] = useState<EncircledArea[]>([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onSave = (values: any) => {
    const saveInjury = async (injury: EncircledArea, reportId: number) => {
      try {
        const createInjuryResponse = await fetch("/api/injury/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: injury.id,
            reportId: reportId,
            xPos: injury.x,
            yPos: injury.y,
            label: injury.label,
            injuryDescription: injury.injuryDescription,
          }),
        });

        if (!createInjuryResponse.ok) {
          console.error("Error:", createInjuryResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const saveReport = async () => {
      try {
        const createReportResponse = await fetch("/api/report/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.sub,
            name: values.name,
            datetime: values.datetime,
          }),
        });

        if (createReportResponse.ok) {
          const data = await createReportResponse.json();
          return data.id;
        } else {
          console.error("Error:", createReportResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    saveReport().then((id) => {
      EncircledAreas.forEach((encircleAria: EncircledArea) => {
        saveInjury(encircleAria, id);
      });
      message.success("Report Saved");
      onClose();
    });
  };

  function updateEncircledAreas(areas: EncircledArea[]): void {
    setEncircledAreas(areas);
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
        destroyOnClose={true}
        footer={null}
      >
        <Divider />
        <Form {...layout} name="control-hooks" onFinish={onSave}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="datetime" label="Date/Time">
            <DatePicker showTime />
          </Form.Item>
          <Divider />
          <BodyMap
            onUpdateEncircledAreas={updateEncircledAreas}
            forEdit={false}
            editReportId={null}
          />
          <Divider />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ float: "right" }}>
              <Button
                danger
                onClick={onClose}
                size="large"
                style={{ padding: "0 40px" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ padding: "0 40px" }}
              >
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateReportModal;
