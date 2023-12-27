import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index.js';
import supertest from 'supertest';
const dbConnect = require('../db');

const request = new supertest(app);
var user1 = {}
var user2 = {}

describe('test messages api routes', () => {
  beforeAll(async () => {
    dbConnect(process.env.MONGO_TEST_URI);
    const responseDelete = await request.delete(`/api/auth/deleteUsers`);
    const response1 = await request.post(`/api/auth/register`).send({
        email: 'test3@gmail.com',
        username: 'test_user3',
        password: 'test123456',
      });
    const response2 = await request.post(`/api/auth/register`).send({
        email: 'test2@gmail.com',
        username: 'test_user2',
        password: 'test123456',
      });
      user1 = response1.body.userDetails;
      user2 = response2.body.userDetails;
});
  it('should send message', async () => {
    const response = await request.post(`/api/messages/addMessage`).send({
      from: user1.id, to: user2.id, message: "hi"
    });
    expect(response.status).toBe(200);
  });
  it('should not send message from invalid user', async () => {
    const response = await request.post(`/api/messages/addMessage`).send({
      from: '34567890', to: user2.id, message: "hi"
    });
    expect(response.status).toBe(500);
  });
  it('should get messages between 2 users', async () => {
    const response = await request.post(`/api/messages/getAllMessages`).send({
        from: user1.id, to: user2.id
    });
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toStrictEqual({ fromSelf: true, message: 'hi' });
  });
});