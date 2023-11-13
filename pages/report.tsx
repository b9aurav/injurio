import React, { useEffect, useRef, useState } from "react";
import { Button, Input, InputRef, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FilterConfirmProps } from "antd/es/table/interface";
import CreateReportModal from "@/components/createReportModal";
import EditReportModal from "@/components/editReportModal";
import { useQuery } from "@apollo/client";
import { GET_USER_REPORTS } from "@/graphql/queries";

interface DataType {
  id: number;
  name: string;
  datetime: Date;
  created_at: Date;
}

const Report: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(0);
  const [selectedReportName, setSelectedReportName] = useState("");
  const [selectedReportInjuryDate, setSelectedReportInjuryDate] = useState(
    new Date()
  );
  const [data, setData] = useState([]);
  const { user } = useUser();

  const [messageApi, contextHolder] = message.useMessage();

  const loader = () => {
    messageApi.open({
      type: "loading",
      content: "Please wait...",
      duration: 0,
    });
  };

  const {
    loading,
    error,
    data: queryData,
    refetch,
  } = useQuery(GET_USER_REPORTS, {
    variables: { userId: user?.sub },
  });

  useEffect(() => {
    if (loading) {
      loader();
    } else {
      messageApi.destroy();
      setData(queryData?.user?.reports || []);
    }
  }, [loading, queryData]);

  const openCreateReportModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateReportModal = async () => {
    setCreateModalOpen(false);
    await refetch();
  };

  const openEditReportModal = (
    report: number,
    name: string,
    injuryDate: Date
  ) => {
    setSelectedReportId(report);
    setSelectedReportName(name);
    setSelectedReportInjuryDate(injuryDate);
    setEditModalOpen(true);
  };

  const closeEditReportModal = async () => {
    setEditModalOpen(false);
    await refetch();
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
      width: "30%",
      sorter: (a, b) => a.name.length - b.name.length,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
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
              onPressEnter={() => handleSearch(confirm, "name")}
              style={{ display: "block" }}
            />
            <Button
              type="primary"
              shape="round"
              onClick={() => handleSearch(confirm, "name")}
              icon={<SearchOutlined />}
              size="small"
            />
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined
          style={{ color: filtered ? "#1677ff" : undefined }}
        ></SearchOutlined>
      ),
      onFilter: (value, record) =>
        record["name"]
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
      title: "Injury Date",
      dataIndex: "datetime",
      render: (datetime) => new Date(datetime).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.datetime).getDate() - new Date(b.datetime).getDate(),
    },
    {
      title: "Report Date",
      dataIndex: "created_at",
      render: (datetime) => new Date(datetime).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.created_at).getDate() - new Date(b.created_at).getDate(),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      width: "23%",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            openEditReportModal(record.id, record.name, record.datetime)
          }
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="center">
        <Button
          className="primary-btn"
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ margin: "1rem" }}
          onClick={openCreateReportModal}
        >
          Report
        </Button>
        <CreateReportModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateReportModal}
        />
        <EditReportModal
          reportId={selectedReportId}
          name={selectedReportName}
          injuryDate={selectedReportInjuryDate}
          isOpen={isEditModalOpen}
          onClose={closeEditReportModal}
        />
      </div>
      <div className="parent-div">
        <h3 className="report-heading">Your Reports</h3>
        <Table
          bordered
          columns={columns}
          scroll={{ y: "max-width" }}
          dataSource={data}
        />
      </div>
    </>
  );
};

export default Report;
