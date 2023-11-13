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
import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { CREATE_REPORT, CREATE_INJURY } from "@/graphql/queries";

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

  const [createReport] = useMutation(CREATE_REPORT);
  const [createInjury] = useMutation(CREATE_INJURY);

  const onSave = async (values: any) => {
    const saveInjury = async (injury: EncircledArea, reportId: number) => {
      const { data: createInjuryData } = await createInjury({
        variables: {
          data: {
            reportId: reportId,
            x: injury.x,
            y: injury.y,
            label: injury.label,
            injuryDescription: injury.injuryDescription,
          },
        },
      });
    };

    const saveReport = async () => {
      try {
        const { data: createReportData } = await createReport({
          variables: {
            data: {
              userId: user?.sub,
              name: values.name,
              datetime: values.datetime || dayjs(),
            },
          },
        });

        if (createReportData && createReportData.createInjuryReport) {
          const createdReportId = createReportData.createInjuryReport.id;
          return createdReportId;
        }
      } catch (error) {
        console.error("Error creating report:", error);
        return null;
      }
    };

    const reportId: any = await saveReport();
    EncircledAreas.forEach((encircleAria: EncircledArea) => {
      const element = document.querySelector(
        "#detail-text-" + encircleAria.id
      ) as HTMLInputElement;
      encircleAria.injuryDescription = element.value;
      saveInjury(encircleAria, reportId);
    });
    message.success("Report Saved");
    onClose();
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
            <DatePicker showTime defaultValue={dayjs()} />
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
