import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://injurio.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});

export default apolloClient;
