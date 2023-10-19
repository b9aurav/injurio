import React from "react";
import { Button, Col, Row, Space, Tooltip } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import Head from "next/head";

const Login: React.FC = () => {
  return (
    <>
      <Head>
        <title>Get Started | Injurio</title>
      </Head>
      <Row>
        <Col flex="1 1 200px">
          <div className="center login-left-div">
            <div style={{ textAlign: "center" }}>
              <Space direction="vertical">
                <img
                  src="logo.png"
                  alt="logo"
                  style={{ filter: "drop-shadow(2px 4px 6px black)" }}
                />
                <Button href="/api/auth/login" size="large">
                  Get Started
                </Button>
              </Space>
            </div>
          </div>
        </Col>
        <Col flex="1 1 1000px">
        <div className="bg"></div>
          <div className="bg bg2"></div>
          <div className="bg bg3"></div>
          <div className="center login-right-div">
            <Space direction="vertical" className="center">
              <img src="logo-full.png" alt="full logo" width={350} />
              <label
                style={{
                  color: "white",
                  fontSize: "x-large",
                  fontFamily: "math",
                }}
              >
                Track & Manage Injuries
              </label>
              <Tooltip title="GitHub Repository">
                <Button
                  href="https://github.com/b9aurav/injurio"
                  shape="circle"
                  size="large"
                  icon={<GithubOutlined />}
                />
              </Tooltip>
            </Space>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Login;
