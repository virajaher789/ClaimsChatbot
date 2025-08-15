const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app, resetClaims } = require('./app');

test.afterEach(() => {
  resetClaims();
});

test('POST /claims creates a claim', async () => {
  const response = await request(app)
    .post('/claims')
    .send({ type: 'motor', customerName: 'Aisling', incidentDate: '2025-01-15' })
    .expect(201);

  assert.match(response.body.claimNumber, /^CLM/);
  assert.equal(response.body.status, 'submitted');
});

test('GET /claims/:claimNumber retrieves a claim', async () => {
  const postRes = await request(app)
    .post('/claims')
    .send({ type: 'health', customerName: 'Maya', incidentDate: '2025-01-10' })
    .expect(201);

  const { claimNumber } = postRes.body;
  const getRes = await request(app).get(`/claims/${claimNumber}`).expect(200);
  assert.equal(getRes.body.claimNumber, claimNumber);
});

test('POST /claims validates required fields', async () => {
  await request(app).post('/claims').send({}).expect(400);
});
