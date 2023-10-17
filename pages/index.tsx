import { useUser } from "@auth0/nextjs-auth0/client";
import Login from "./login";
import Home from "./home";
import Loader from "@/components/loader";

const Index = () => {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) return <Loader />;
  if (user) return <Home />
  if (error) return <div>{error.message}</div>;

  return <Login />;
};

export default Index;
