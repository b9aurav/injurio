import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  Space,
  theme,
} from "antd";
import Report from "./report";

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
        const createUserResponse = await fetch(
          "/api/user/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.user?.sub,
              name: user.user?.nickname,
            }),
          }
        );
        if (!createUserResponse.ok) {
          console.error("Error:", createUserResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchUser();
  }, [user]);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button type="primary" danger style={{ width: "100%" }}>
          <a href="/api/auth/logout">Logout</a>
        </Button>
      ),
    },
  ];

  return (
    <Layout className="layout">
      <Header className="header">
        <Row>
          <Col span={8}>
            <h3 className="title">Injurio</h3>
          </Col>
          <Col span={16}>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Dropdown menu={{ items }} placement="bottomRight">
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
      <Content style={{ padding: "0 50px" }}>
        <Report />
      </Content>
    </Layout>
  );
};

export default Home;
