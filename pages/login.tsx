import React from 'react';
import { Button, Space } from 'antd';
import { useUser } from '@auth0/nextjs-auth0/client'

const Login: React.FC = () => {
  const { user, error, isLoading } = useUser();

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Space direction='vertical'>
            <h1>Injurio</h1>
            <p>Track and Manage Injuries</p>
            <Button type="primary"><a href='/api/auth/login'>Login</a></Button>
        </Space>
      </div>
    </div>
  );
};

export default Login;
