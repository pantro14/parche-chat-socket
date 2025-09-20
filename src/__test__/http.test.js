// __tests__/http.test.js
const request = require('supertest');
const { app, server } = require('../server');

describe('Http server', () => {
  afterAll(() => {
    server.close();
  });
  test('GET / should return health message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('parche chat web socket is running');
  });
});
