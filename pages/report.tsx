import React, { useEffect, useRef, useState } from "react";
import { Button, Input, InputRef, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FilterConfirmProps } from "antd/es/table/interface";
import CreateReportModal from "@/components/createReportModal";
import EditReportModal from "@/components/editReportModal";

interface DataType {
  id: number,
  name: string;
  datetime: Date;
  created_at: Date;
}

const Report: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(0);
  const [selectedReportName, setSelectedReportName] = useState('');
  const [selectedReportInjuryDate, setSelectedReportInjuryDate] = useState(new Date());
  const [data, setData] = useState([]);
  const { user } = useUser();

  const openCreateReportModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateReportModal = () => {
    setCreateModalOpen(false);
    getReports().then((reports) => {
      setData(reports);
    });
  };

  const openEditReportModal = (report: number, name: string, injuryDate: Date) => {
    setSelectedReportId(report);
    setSelectedReportName(name);
    setSelectedReportInjuryDate(injuryDate);
    setEditModalOpen(true);
  };

  const closeEditReportModal = () => {
    setEditModalOpen(false);
    getReports().then((reports) => {
      setData(reports);
    });
  };

  type DataIndex = keyof DataType;

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
      }) => (
        <div
          style={{ padding: 8, display: "flex" }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Space>
            <Input
              ref={searchInput}
              placeholder={`Search by Name`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(confirm, 'name')}
              style={{ display: "block" }}
            />
            <Button
              type="primary"
              onClick={() => handleSearch(confirm, 'name')}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }}></SearchOutlined>
      ),
      onFilter: (value, record) =>
        record['name']
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    {
      title: "Date/Time of Injury",
      dataIndex: "datetime",
      render: (datetime) => new Date(datetime).toLocaleString(),
      sorter: (a, b) => new Date(a.datetime).getDate() - new Date(b.datetime).getDate()
    },
    {
      title: "Date/Time of Report",
      dataIndex: "created_at",
      render: (datetime) => new Date(datetime).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at).getDate() - new Date(b.created_at).getDate()
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (_, record) => <Button type="primary" onClick={() => openEditReportModal(record.id, record.name, record.datetime)}><EyeOutlined /></Button>,
    },
  ];

  const getReports = async () => {
    try {
      const getReportsResponse = await fetch("/api/report/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.sub,
        }),
      });
      if (getReportsResponse.ok) {
        return await getReportsResponse.json();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getReports().then((reports) => {
      setData(reports);
    });
  }, [])

  return (
    <>
      <div className="center">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ margin: "1rem" }}
          onClick={openCreateReportModal}
        >
          Report
        </Button>
        <CreateReportModal isOpen={isCreateModalOpen} onClose={closeCreateReportModal} />
        <EditReportModal reportId={selectedReportId} name={selectedReportName} injuryDate={selectedReportInjuryDate} isOpen={isEditModalOpen} onClose={closeEditReportModal} />
      </div>
      <Table bordered columns={columns} scroll={{ y: 'max-width' }} dataSource={data} />
    </>
  );
};

export default Report;
