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
import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import {
  EDIT_REPORT,
  CREATE_INJURY,
  DELETE_REPORT,
  DELETE_INJURY,
} from "@/graphql/queries";

interface EncircledArea {
  id: number;
  label: number;
  x: number;
  y: number;
  injuryDescription: string;
}

const EditReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  name: string;
  injuryDate: Date;
}> = ({ isOpen, onClose, reportId, name, injuryDate }) => {
  const [EncircledAreas, setEncircledAreas] = useState<EncircledArea[]>([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [editReport] = useMutation(EDIT_REPORT);
  const [createInjury] = useMutation(CREATE_INJURY);
  const [deleteReport] = useMutation(DELETE_REPORT);
  const [deleteAllInjury] = useMutation(DELETE_INJURY);

  const removeReport = async () => {
    const { data: deleteReportData } = await deleteReport({
      variables: {
        id: reportId,
      },
    });
    if (deleteReportData && deleteReportData.deleteInjuryReport) {
      onClose();
      message.success("Report deleted");
    }
  };

  const onSave = (values: any) => {
    const saveInjury = async (injury: EncircledArea) => {
      const injuryData = {
          reportId: reportId,
          x: injury.x,
          y: injury.y,
          label: injury.label,
          injuryDescription: injury.injuryDescription,
      }
      const { data: createInjuryData } = await createInjury({
        variables: {
          data: injuryData
        },
      });
    };

    const deleteAllInjuries = async () => {
      const { data: deleteInjuryData } = await deleteAllInjury({
        variables: {
          reportId: reportId,
        },
      });
    };

    const saveReport = async () => {
      try {
        const { data: editReportData } = await editReport({
          variables: {
            data: {
              name: values.name,
              datetime: values.datetime || dayjs(),
            },
            id: reportId,
          },
        });

        if (editReportData && editReportData.createInjuryReport) {
          const createdReportId = editReportData.createInjuryReport.id;
          return createdReportId;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    saveReport().then(() => {
      EncircledAreas.forEach((encircleAria: EncircledArea) => {
        const element = document.querySelector(
          "#detail-text-" + encircleAria.label
        ) as HTMLInputElement;
        const updatedEncircleAria = { ...encircleAria };
        updatedEncircleAria.injuryDescription = element.value;
        deleteAllInjuries();
        saveInjury(updatedEncircleAria);
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
            <Input defaultValue={name} />
          </Form.Item>
          <Form.Item name="datetime" label="Date/Time">
            <DatePicker defaultValue={dayjs(injuryDate)} showTime />
          </Form.Item>
          <Divider />
          <BodyMap
            onUpdateEncircledAreas={updateEncircledAreas}
            forEdit={true}
            editReportId={reportId}
          />
          <Divider />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space style={{ float: "right" }}>
              <Popconfirm
                title="Delete the task"
                description="Are you sure want to delete this report?"
                onConfirm={removeReport}
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
