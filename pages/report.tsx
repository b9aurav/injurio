import React from 'react';
import { Button, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined } from "@ant-design/icons";

const Report: React.FC = () => {
    return (
        <div className="center">
            <Button type="primary" icon={<PlusOutlined />} size="large" style={{ margin: "1rem" }}>
                Report
            </Button>
        </div>
    );
}

export default Report;