import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";

let server: ApolloServer;

try {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Enable introspection for debugging
    formatError: (err) => {
      console.error("GraphQL Error:", err);
      return err;
    },
  });
} catch (error) {
  console.error("Error creating Apollo Server:", error);
  throw error;
}

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => ({ req }),
});

export { handler as GET, handler as POST };
