import { useUser } from "@auth0/nextjs-auth0/client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Dropdown, MenuProps, Space, Typography, message } from "antd";
import DownOutlined from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { GET_USER_REPORTS } from "@/graphql/queries";

Chart.register([
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
]);

const Analytics = () => {
  const user = useUser();
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });
  const [selectedChartType, setSelectedChartType] = useState("bar");

  const [messageApi, contextHolder] = message.useMessage();

  const loader = () => {
    messageApi.open({
      type: 'loading',
      content: 'Please wait...',
      duration: 0,
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "bar",
      label: <a onClick={() => setSelectedChartType("bar")}>Bar</a>,
    },
    {
      key: "area",
      label: <a onClick={() => setSelectedChartType("area")}>Area</a>,
    },
  ];

  const {
    loading,
    error,
    data: queryData,
  } = useQuery(GET_USER_REPORTS, {
    variables: { userId: user.user?.sub },
  });

  useEffect(() => {
    const getReportData = async () => {
      try {
        if (queryData) {
          const countsMap: { [key: string]: number } = {};
          queryData.user.reports.forEach((element: any) => {
            const label: string =
              (dayjs(element.datetime).month() + 1).toString() +
              "/" +
              dayjs(element.datetime).year().toString();

            if (label in countsMap) {
              countsMap[label]++;
            } else {
              countsMap[label] = 1;
            }
          });

          const labels = Object.keys(countsMap);
          const data = Object.values(countsMap);
          setChartData({ labels, data });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loader();
    getReportData();
    messageApi.destroy();
  }, [user]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Injuries per month",
      },
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        fill: true,
        label: "Injuries",
        data: chartData.data,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="parent-div" style={{ marginTop: "15px" }}>
      <div className="center">
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ["bar"],
          }}
        >
          <Typography.Link>
            <Space>
              Select Chart Type
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      </div>
      <div className="center" style={{maxHeight: '688px'}}>
      {selectedChartType === "bar" && <Bar data={data} options={options} />}
      {selectedChartType === "area" && <Line data={data} options={options} />}
      </div>
    </div>
  );
};

export default Analytics;
