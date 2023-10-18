import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Space, Table, Tooltip, message } from "antd";
import { ColumnsType } from "antd/es/table";

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

  const onUpdateDetails = (id: number, newDetail: string) => {
    const updatedAreas = encircledAreas.map((area) =>
      area.id === id ? { ...area, injuryDescription: newDetail } : area
    );
    setEncircledAreas(updatedAreas);
    onUpdateEncircledAreas(updatedAreas);
  };

  const loadSavedEncircledArea = async () => {
    try {
      const getInjuryDetailsResponse = await fetch("/api/injury/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: editReportId,
        }),
      });

      if (getInjuryDetailsResponse.ok) {
        const data = await getInjuryDetailsResponse.json();
        // Filtering reportId from fetched data
        const filteredData: EncircledArea[] = data.map(
          ({ reportId, ...rest }: { reportId: any; [key: string]: any }) => rest
        );
        setEncircledAreas(filteredData);
        onUpdateEncircledAreas(filteredData);
      } else {
        console.error("Error:", getInjuryDetailsResponse.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (forEdit) {
      loadSavedEncircledArea();
    }
  }, []);

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
            id={"detail-text-" + record.id}
            defaultValue={
              forEdit
                ? encircledAreas.find((area) => area.id === record.id)
                    ?.injuryDescription
                : ""
            }
          />
          <Button
            onClick={(e) => {
              const detailInput = document.querySelector(
                "#detail-text-" + record.id
              ) as HTMLInputElement;
              onUpdateDetails(record.id, detailInput.value);
              message.success("Details Updated");
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
        <label className="center">
          Make sure to click 'Update' after giving injury details.
        </label>
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
