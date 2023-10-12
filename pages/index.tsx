import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

import { Button } from 'antd'
import Login from './login';

const index = () => {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  if (user) {
    return (
      <div>
        Welcome, {user.name}<br/>
        <Button type="primary">
          <a href='/api/auth/logout'>Logout</a>
        </Button>
      </div>
    )
  }

  return <Login />
}

export default index