import { GraphQLClient } from 'graphql-request';

const getEndpoint = () => {
  const envEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql';
  
  if (envEndpoint.startsWith('http://') || envEndpoint.startsWith('https://')) {
    return envEndpoint;
  }
  
  return `${window.location.origin}${envEndpoint}`;
};

export const graphqlClient = new GraphQLClient(getEndpoint(), {
  credentials: 'include',
});

