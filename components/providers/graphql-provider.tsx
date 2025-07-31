"use client";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/graphql/client";

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
