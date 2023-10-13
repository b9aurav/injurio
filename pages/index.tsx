import React, { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Login from "./login";
import Home from "./home";

const Index = () => {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (user) return <Home />
  if (error) return <div>{error.message}</div>;

  return <Login />;
};

export default Index;
