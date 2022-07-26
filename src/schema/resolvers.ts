import { Users } from '../mocks/db';

export default {
  Query: {
    hello: () => 'Hello world',

    getAllUsers: () => {
      return Users;
    },

    getUser: (_root: any, args: { id: number }) => {
      const { id } = args;

      if (!id) return null;

      const user = Users.find((user) => user.id === id);

      if (!user) return null;

      return user;
    },
  },
};
