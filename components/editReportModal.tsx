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
import dayjs from "dayjs";

interface EncircledArea {
  id: number;
  label: number;
  x: number;
  y: number;
  injuryDescription: string;
}

const EditReportModal: React.FC<{ isOpen: boolean; onClose: () => void; reportId: number, name: string, injuryDate: Date }> = ({
  isOpen,
  onClose,
  reportId,
  name,
  injuryDate
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
    const saveInjury = async (injury: EncircledArea) => {
      try {
        const createInjuryResponse = await fetch("/api/injury/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: injury.id,
            reportId: reportId,
            label: injury.label,
            xPos: injury.x,
            yPos: injury.y,
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

    const deleteAllInjuries = async () => {
      try {
        const deleteAllInjuriesResponse = await fetch("/api/injury/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId: reportId,
          }),
        });

        if (!deleteAllInjuriesResponse.ok) {
          console.error("Error:", deleteAllInjuriesResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const saveReport = async () => {
      try {
        const updateReportResponse = await fetch("/api/report/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId: reportId,
            name: values.name,
            datetime: values.datetime,
          }),
        });

        if (updateReportResponse.ok) {
          const data = await updateReportResponse.json();
          return data.id;
        } else {
          console.error("Error:", updateReportResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    saveReport().then(() => {
      EncircledAreas.forEach((encircleAria: EncircledArea) => {
        deleteAllInjuries();
        saveInjury(encircleAria);
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
            <Input defaultValue={name}/>
          </Form.Item>
          <Form.Item name="datetime" label="Date/Time">
            <DatePicker defaultValue={dayjs(injuryDate)} showTime />
          </Form.Item>
          <Divider />
          <BodyMap onUpdateEncircledAreas={updateEncircledAreas} forEdit={true} editReportId={reportId} />
          <Divider />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ float: "right" }}>
              <Popconfirm
                title="Delete the task"
                description="Are you sure want to delete this report?"
                onConfirm={deleteReport}
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
