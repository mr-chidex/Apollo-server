import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import morgan from 'morgan';

import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers';

const app = express();
app.use(cors());
app.use(morgan('dev'));
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });
});

export default app;
