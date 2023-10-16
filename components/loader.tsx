import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loader: React.FC = () => <div className='loader center'><Spin size='large' indicator={antIcon} /></div>;

export default Loader;