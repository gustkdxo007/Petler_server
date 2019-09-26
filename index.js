import express from "express";
import { ApolloServer } from "apollo-server-express";
import sequelize from "./models";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

const PORT = 4000;

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
sequelize.sequelize.sync();
server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
