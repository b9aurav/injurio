import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Space, Table, Tooltip, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useQuery } from "@apollo/client";
import { GET_INJURY_DETAILS } from "@/graphql/queries";

interface EncircledArea {
  id: number;
  label: number;
  x: number;
  y: number;
  injuryDescription: string;
}

const BodyMap: React.FC<{
  onUpdateEncircledAreas: (areas: EncircledArea[]) => void;
  forEdit: boolean;
  editReportId: number | null;
}> = ({ onUpdateEncircledAreas, forEdit, editReportId }) => {
  const [encircledAreas, setEncircledAreas] = useState<EncircledArea[]>([]);

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
      label: encircledAreas.length + 1,
      injuryDescription: "",
    };
    setEncircledAreas([...encircledAreas, newArea]);
    onUpdateEncircledAreas([...encircledAreas, newArea]);
  };

  const handleDeleteArea = (id: number) => {
    const updatedAreas = encircledAreas.filter((area) => area.id !== id);
    
    setEncircledAreas(updatedAreas);
    onUpdateEncircledAreas(updatedAreas);
  };

  if (forEdit) {
    const { error, data: injuryData, refetch } = useQuery(GET_INJURY_DETAILS, {
      variables: { reportId: editReportId },
    });
    useEffect(() => {
      if (injuryData != undefined) {
        refetch();
        const fetchEncircledAreas = async () => {
          setEncircledAreas(injuryData?.injuryDetail);
        };
        fetchEncircledAreas();
      }
    }, [injuryData, error]);
  }

  const updateDescription = (label: number)  => {
      const updatedAreas = encircledAreas.map((area) => {
        const element = document.querySelector(
          "#detail-text-" + label
        ) as HTMLInputElement;
        const updatedArea = { ...area };
        updatedArea.injuryDescription = element.value || "";
    
        return updatedArea;
      });
      setEncircledAreas(updatedAreas);
      onUpdateEncircledAreas(updatedAreas);
  }

  const columns: ColumnsType<EncircledArea> = [
    {
      title: "Label",
      key: "id",
      render: (record) => <span>{record.label}</span>,
    },
    {
      title: "Details",
      key: "detail",
      render: (record) => (
        <Space>
          <Input
            id={"detail-text-" + record.label}
            onChange={() => updateDescription(record.label)}
            defaultValue={
              forEdit
                ? encircledAreas.find((area) => area.label === record.label)
                    ?.injuryDescription
                : ""
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col sm={12} xs={24}>
        <label className="center">
          Click on below body parts to create injury and click again to delete
          it.
        </label>
        <div className="bodyContainer" onClick={handleAreaClick}>
          <img src="body.png" alt="Body Outline" />
          {encircledAreas.map((area) => (
            <div
              key={area.id}
              className="clickableArea center"
              style={{ left: `${area.x - 15}px`, top: `${area.y - 15}px` }}
            >
              <Tooltip title="Delete">
                <span className="areaId">{area.label}</span>
                <Button
                  className="deleteButton"
                  type="primary"
                  onClick={() => handleDeleteArea(area.id)}
                  shape="circle"
                  size="small"
                  danger
                />
              </Tooltip>
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
