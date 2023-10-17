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
  Space,
  theme,
} from "antd";
import Report from "./report";
import { Footer } from "antd/es/layout/layout";
import { GithubOutlined } from "@ant-design/icons";
import Head from "next/head";

const { Header, Content } = Layout;

const Home: React.FC = () => {
  const user = useUser();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch existing user data
        const getUserResponse = await fetch("/api/user/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.user?.sub,
          }),
        });

        if (getUserResponse.ok) {
          const data = await getUserResponse.json();
          if (!data.found) {
            createUser();
          }
        } else {
          console.error("Error:", getUserResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const createUser = async () => {
      try {
        const createUserResponse = await fetch("/api/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.user?.sub,
            name: user.user?.nickname,
          }),
        });
        if (!createUserResponse.ok) {
          console.error("Error:", createUserResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, [user]);

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
            <Report />
          </Content>
          <Footer
          className="center footer"
        >
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
