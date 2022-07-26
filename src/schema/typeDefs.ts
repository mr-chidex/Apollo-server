import { gql } from 'apollo-server-express';

const typeDef = gql`
  type User {
    id: Int!
    name: String!
    age: Int!
    married: Boolean!
  }

  # Queries
  type Query {
    hello: String!
    getAllUsers: [User!]
    getUser(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, age: Int!, married: Boolean!): User!
  }
`;

export default typeDef;
