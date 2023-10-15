import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  message,
} from "antd";
import BodyMap from "./bodyMap";

interface EncircledArea {
  id: number;
  x: number;
  y: number;
  detail: string;
}

const EditReportModal: React.FC<{ isOpen: boolean; onClose: () => void; reportId: number }> = ({
  isOpen,
  onClose,
  reportId
}) => {
  const [EncircledAreas, setEncircledAreas] = useState<EncircledArea[]>([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const deleteReport = async () => {
    try {
      const deleteReportResponse = await fetch("/api/report/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: reportId,
        }),
      });

      if (deleteReportResponse.ok) {
        onClose();
        message.success('Report deleted')
      } else {
        console.error("Error:", deleteReportResponse.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
            detail: injury.detail,
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
            // userId: user?.sub,
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
        title="Edit Report"
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
          <BodyMap onUpdateEncircledAreas={updateEncircledAreas} />
          <Divider />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ float: "right" }}>
              <Popconfirm
                title="Delete the task"
                description="Are you sure want to delete this report?"
                onConfirm={deleteReport}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  type="primary"
                  size="large"
                  style={{ padding: "0 40px" }}
                >
                  Delete
                </Button>
              </Popconfirm>
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

export default EditReportModal;
