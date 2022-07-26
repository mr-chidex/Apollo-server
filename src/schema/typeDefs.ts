import { gql } from 'apollo-server-express';

const typeDef = gql`
  # Queries
  type Query {
    hello: String!
  }
`;

export default typeDef;
