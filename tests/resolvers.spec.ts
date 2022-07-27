import { Server } from 'http';
import request from 'supertest';

import app from '../src/app';
import { Users } from '../src/mocks/db';

describe('Schema resolvers', () => {
  interface TestUser {
    name: string;
    age: number;
    married: boolean;
  }

  describe('Query', () => {
    describe('Hello', () => {
      it('should return hello world string', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({
            query: `{
            hello 
        }`,
          });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('hello');
        expect(response.body.data.hello).toBe('Hello world');
      });
    });

    describe('Get all users', () => {
      it('should return a list of users', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({
            query: `{
            getAllUsers {
              name
            } 
          }`,
          });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('getAllUsers');
      });
    });

    describe('Get user by id', () => {
      let user: any;

      beforeEach(() => {
        // simulating creating a test user in test db
        user = { id: Users.length + 1, name: 'test', age: 0, married: true };
        Users.push(user);
      });

      afterEach(() => {
        // simulating deleting test user from test db
        const idx = Users.findIndex((usr) => usr.id === user.id);
        Users.splice(idx, 1);
      });

      it('should return user data with given id', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({
            query: `{
              getUser (id: ${user.id}) {
              name
            } 
          }`,
          });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('getUser');
        expect(response.body.data.getUser).toHaveProperty('name');
        expect(response.body.data.getUser.name).toBe('test');
      });

      it('should return error code and null data on invalid user id', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({
            query: `{
              getUser (id: 0) {
              name
            } 
          }`,
          });

        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].code).toBe(400);
        expect(response.body.data).toHaveProperty('getUser');
        expect(response.body.data.getUser).toBeNull();
      });

      it('should return error code 404 and null data if no user is found', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({
            query: `{
              getUser (id: 1000) {
              name
            } 
          }`,
          });

        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].code).toBe(404);
        expect(response.body.data).toHaveProperty('getUser');
        expect(response.body.data.getUser).toBeNull();
      });
    });
  });

  describe('Mutation', () => {
    describe('create user', () => {
      let user: TestUser;

      beforeAll(() => {
        user = { name: 'test', age: 20, married: true };
      });

      afterAll(() => {
        // simulating deleting test user from test db
        const idx = Users.findIndex((usr) => usr.name === user.name);
        Users.splice(idx, 1);
      });

      it('should be able to add a new user', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({
            query: `
                mutation {
                  createUser ( userInput: { name: "${user.name}", age: ${user.age}, married: ${user.married} } ) {
                    name
                    age
                   } 
                }
            `,
          });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('createUser');
        expect(response.body.data.createUser).toHaveProperty('name');
        expect(response.body.data.createUser).toHaveProperty('age');
        expect(response.body.data.createUser.name).toBe('test');
      });

      it('should return error code 422 on invalid user data', async () => {
        const response = await request(app)
          .post('/graphql')
          .send({
            query: `
                mutation {
                  createUser ( userInput: { name: "${user.name}", age: ${0}, married: ${user.married} } ) {
                    name
                    age
                   } 
                }
            `,
          });

        expect(response.body.errors[0].code).toBe(422);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('errors');
        expect(response.body.data).toBeNull();
      });
    });
  });
});
