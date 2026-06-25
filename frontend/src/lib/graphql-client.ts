import { GraphQLClient } from 'graphql-request';

const PROD_GRAPHQL_ENDPOINT = 'https://api.gavrafana.com/graphql';

const getEndpoint = () => {
  const envEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;

  if (envEndpoint) {
    if (envEndpoint.startsWith('http://') || envEndpoint.startsWith('https://')) {
      return envEndpoint;
    }

    return `${window.location.origin}${envEndpoint}`;
  }

  return import.meta.env.PROD ? PROD_GRAPHQL_ENDPOINT : `${window.location.origin}/graphql`;
};

export const graphqlClient = new GraphQLClient(getEndpoint(), {
  credentials: 'include',
});