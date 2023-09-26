import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";

import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import { authMiddleware, handleLogin } from "./auth.js";
import { resolvers } from "./resolvers.js";
import { getUser } from "./db/users.js";
import { createCompanyLoader } from "./db/companies.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

async function getContext({ req }) {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  if (req.auth) {
    const { sub } = req.auth;
    context.user = await getUser(sub);
  }
  return context;
}

const typeDefs = await readFile("./schema.graphql", "utf-8");

const apolloserver = new ApolloServer({ typeDefs, resolvers });

await apolloserver.start();

app.use("/graphql", apolloMiddleware(apolloserver, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQl endpoint: http://localhost:${PORT}`);
});
