import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index.js';
import supertest from 'supertest';
const dbConnect = require('../db');

const request = new supertest(app);
var user = {};
describe('test user api routes', () => {
  beforeAll(async () => {
    dbConnect(process.env.MONGO_TEST_URI);
    const response = await request.delete(`/api/auth/deleteUsers`);
  });
  describe('POST /api/auth/register', () => {
    it('should register user', async () => {
      const response = await request.post(`/api/auth/register`).send({
        email: 'test@gmail.com',
        username: 'test_user',
        password: 'test123456',
      });
      user = response.body.userDetails;
      expect(response.body.status).toBe(200);
    });
    it('email should be unique', async () => {
      const response = await request.post(`/api/auth/register`).send({
        email: 'test@gmail.com',
        username: 'test_user_2',
        password: 'test123456',
      });
      expect(response.body.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user', async () => {
      const response = await request.post(`/api/auth/login`).send({
        email: 'test@gmail.com',
        password: 'test123456',
      });
      expect(response.body.status).toBe(200);
    });
    it('should not login user with non-registered email', async () => {
      const response = await request.post(`/api/auth/login`).send({
        email: 'incorrecttest@gmail.com',
        password: 'test123456',
      });
      expect(response.body.status).toBe(409);
    });
    it('should not login user with incorrect password', async () => {
      const response = await request.post(`/api/auth/login`).send({
        email: 'test@gmail.com',
        password: 'test1234567',
      });
      expect(response.body.status).toBe(400);
    });
  });

  describe('GET /api/auth/allUsers', () => {
    it('should get all users', async () => {
      const response = await request.get(`/api/auth/allUsers/${user.id}`);
      expect(response.status).toBe(200);
    });
  });
});
