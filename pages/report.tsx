import React, { useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import ReportModal from "@/components/modal";

const Report: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openReportModal = () => {
    setModalOpen(true);
  };

  const closeReportModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="center">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        style={{ margin: "1rem" }}
        onClick={openReportModal}
      >
        Report
      </Button>
      <ReportModal isOpen={isModalOpen} onClose={closeReportModal} />
    </div>
  );
};

export default Report;
