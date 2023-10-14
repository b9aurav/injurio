import React from "react";
import { Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";

interface EncircledArea {
  id: number;
  detail: string;
}

interface DetailsTableProps {
  encircledAreas: EncircledArea[];
  onUpdateDetails: (id: number, newDetail: string) => void;
}

const columns: ColumnsType<EncircledArea> = [
  {
    title: "Label",
    key: "id",
    render: (record) => <span>{record.id}</span>,
  },
  {
    title: "Details",
    key: "detail",
    render: (record, _, index) => (
      <Input
        value={record.detail}
        onChange={(e) => onUpdateDetails(record.id, e.target.value)}
      />
    ),
  },
];

function onUpdateDetails(id: string, detail: string) {
  
}

const InjuryDetailsTable: React.FC<DetailsTableProps> = ({ encircledAreas, onUpdateDetails }) => {
  return (
    <Table
      bordered
      // style={{ border: "1px solid darkgray", borderRadius: "5px" }}
      pagination={{ hideOnSinglePage: true, pageSize: 5 }}
      columns={columns}
      dataSource={encircledAreas}
    />
  );
};

export default InjuryDetailsTable;
