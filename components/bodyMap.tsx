import React, { useState } from "react";
// import InjuryDetailsTable from "./injuryDetailsTable";
import { Button, Col, Input, Row, Space, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";

interface EncircledArea {
  id: number;
  x: number;
  y: number;
  detail: string;
}

const BodyMap: React.FC<{
  onUpdateEncircledAreas: (areas: EncircledArea[]) => void;
}> = ({ onUpdateEncircledAreas }) => {
  const [encircledAreas, setEncircledAreas] = useState<EncircledArea[]>([]);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

  const handleAreaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "BUTTON") {
      event.stopPropagation(); // Stop event propagation to prevent adding new encircles
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newArea: EncircledArea = {
      x,
      y,
      id: encircledAreas.length + 1,
      detail: "",
    };
    setEncircledAreas([...encircledAreas, newArea]);
    onUpdateEncircledAreas([...encircledAreas, newArea]);
  };

  const handleDeleteArea = (id: number) => {
    const updatedAreas = encircledAreas.filter((area) => area.id !== id);
    setEncircledAreas(updatedAreas);
    onUpdateEncircledAreas(updatedAreas);
  };

  const onUpdateDetails = (id: number, newDetail: string) => {
    const updatedAreas = encircledAreas.map((area) =>
      area.id === id ? { ...area, detail: newDetail } : area
    );
    setEncircledAreas(updatedAreas);
    onUpdateEncircledAreas(updatedAreas);
  };

  const columns: ColumnsType<EncircledArea> = [
    {
      title: "Label",
      key: "id",
      render: (record) => <span>{record.id}</span>,
    },
    {
      title: "Details",
      key: "detail",
      render: (record) => (
        <Space>
          <Input
            id={"detail-text-" + record.id}
            value={inputValues[record.id] || ""}
            onChange={(e) => {
              const { value } = e.target;
              setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [record.id]: value,
              }));
            }}
            />
          {/* onUpdateDetails(record.id, e.currentTarget.previousSibling?.nodeValue) */}
          <Button
            onClick={(e) => {
                const detailInput = document.querySelector(
                    "#detail-text-" + record.id
                    ) as HTMLInputElement;
                    onUpdateDetails(record.id, detailInput.value);
              message.success('Details Updated');
            }}
          >
            Update
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col sm={12} xs={24}>
        <div className="bodyContainer" onClick={handleAreaClick}>
          <img src="body.png" alt="Body Outline" />
          {encircledAreas.map((area) => (
            <div
              key={area.id}
              className="clickableArea center"
              style={{ left: `${area.x - 15}px`, top: `${area.y - 15}px` }}
            >
              <span className="areaId">{area.id}</span>
              <Button
                className="deleteButton"
                type="primary"
                onClick={() => handleDeleteArea(area.id)}
                shape="circle"
                size="small"
                danger
              />
            </div>
          ))}
        </div>
      </Col>
      <Col sm={12} xs={24}>
        <Table
          bordered
          pagination={{ hideOnSinglePage: true, pageSize: 5 }}
          columns={columns}
          dataSource={encircledAreas}
        />
      </Col>
    </Row>
  );
};

export default BodyMap;
