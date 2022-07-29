import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
// import morgan from 'morgan';

import typeDefs from './schema/typeDefs';
import resolvers from './schema/resolvers';

const app = express();
app.use(cors());
app.disable('x-powered-by');
// app.use(morgan('dev'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    }
    if (!err.originalError) {
      return err;
    }

    const message = err.message || 'An error occurred';
    const code = err.extensions.exception?.code || 500;
    return { message, code };
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });
});

export default app;
