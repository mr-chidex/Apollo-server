import { Users } from '../mocks/db';

interface UserInput {
  name: string;
  age: number;
  married: boolean;
}

interface Err extends Error {
  code?: number;
}

export default {
  Query: {
    hello: () => 'Hello world',

    getAllUsers: () => {
      return Users;
    },

    getUser: (_root: any, args: { id: number }) => {
      const { id } = args;

      if (!id) {
        const error: Err = new Error('No id provided');
        error.code = 400;
        throw error;
      }

      const user = Users.find((user) => user.id === id);

      if (!user) {
        const error: Err = new Error('user does not exist');
        error.code = 404;
        throw error;
      }

      return user;
    },
  },
  Mutation: {
    createUser: (_root: any, args: { userInput: UserInput }) => {
      const { userInput } = args;
      const { name, married, age } = userInput;

      if (!name || !age) {
        const error: Err = new Error('invalid user data');
        error.code = 422;
        throw error;
      }

      const id = Users.length + 1;
      const user = { id, name, age, married };
      Users.unshift(user);

      return user;
    },
  },
};
