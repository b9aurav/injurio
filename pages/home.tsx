import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  MenuProps,
  Row,
  Space,
  theme,
} from "antd";

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  const user = useUser();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

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
        <Form
          {...layout}
          name="nest-messages"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name={["user", "name"]}
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "email"]}
            label="Email"
            rules={[{ type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "age"]}
            label="Age"
            rules={[{ type: "number", min: 0, max: 99 }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name={["user", "website"]} label="Website">
            <Input />
          </Form.Item>
          <Form.Item name={["user", "introduction"]} label="Introduction">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Home;
