import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "@/lib/graphql/schema";
import { resolvers } from "@/lib/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export async function GET(request: NextRequest) {
  const handler = startServerAndCreateNextHandler(server);
  return handler(request);
}

export async function POST(request: NextRequest) {
  const handler = startServerAndCreateNextHandler(server);
  return handler(request);
}
