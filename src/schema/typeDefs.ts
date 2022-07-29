import { gql } from 'apollo-server-express';

const typeDef = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
    married: Boolean!
  }

  input UserInputData {
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
    createUser(userInput: UserInputData): User!
  }
`;

export default typeDef;
