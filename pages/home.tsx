import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Avatar,
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Segmented,
  Space,
  message,
  theme,
} from "antd";
import Report from "./report";
import {
  GithubOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Head from "next/head";
import Analytics from "./analytics";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_USER, GET_USER } from "@/graphql/queries";

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  const user = useUser();
  const [SelectedMenu, setSelectedMenu] = useState("Reports");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
    data: userData,
  } = useQuery(GET_USER, {
    variables: { userId: user.user?.sub },
  });
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userData.user === null) {
          // User doesn't exist, create the user
          const { data: createUserData } = await createUser({
            variables: {
              data: {
                id: user.user?.sub,
                name: user.user?.nickname,
              },
            },
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    
    loader();
    fetchUser();
    messageApi.destroy();
  }, [user, loading, userData]);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button
          href="/api/auth/logout"
          type="primary"
          danger
          className="logout-btn"
        >
          Logout
        </Button>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Home | Injurio</title>
      </Head>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              headerBg: "#1d95fb",
              footerPadding: "15px 50px",
            },
          },
        }}
      >
        <Layout className="layout">
          <Header className="header">
            <Row>
              <Col span={8}>
                <img
                  src="logo.png"
                  style={{ verticalAlign: "middle" }}
                  height={50}
                />
              </Col>
              <Col span={16}>
                <div className="flex-end">
                  <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Space>
                      <p style={{ cursor: "pointer" }}>
                        Welcome, {user.user?.nickname}
                      </p>
                      <Avatar
                        style={{ cursor: "pointer" }}
                        shape="square"
                        size="large"
                        src={user.user?.picture}
                      />
                    </Space>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </Header>
          <Content style={{ padding: "0 10px" }}>
            <div className="center" style={{ marginTop: "10px" }}>
              <Segmented
                onChange={(value) => {
                  setSelectedMenu(value.toString());
                }}
                size="large"
                options={[
                  {
                    label: "Reports",
                    value: "Reports",
                    icon: <FileTextOutlined />,
                  },
                  {
                    label: "Analytics",
                    value: "Analytics",
                    icon: <BarChartOutlined />,
                  },
                ]}
              />
            </div>
            {SelectedMenu === "Reports" ? <Report /> : <Analytics />}
          </Content>
          <Footer className="center footer">
            <img src="logo-full.png" width={150} height={40}></img>
            <Button
              href="https://github.com/b9aurav/injurio"
              shape="circle"
              icon={<GithubOutlined />}
            />
          </Footer>
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default Home;
