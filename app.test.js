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
  assert.equal(response.body.progress.length, 1);
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

test('PUT /claims/:claimNumber/status updates a claim status', async () => {
  const postRes = await request(app)
    .post('/claims')
    .send({ type: 'motor', customerName: 'Mark', incidentDate: '2025-01-20' })
    .expect(201);

  const { claimNumber } = postRes.body;
  const putRes = await request(app)
    .put(`/claims/${claimNumber}/status`)
    .send({ status: 'initial_review', description: 'Claim under review', estimatedCompletion: '2025-03-01' })
    .expect(200);

  assert.equal(putRes.body.status, 'initial_review');
  assert.equal(putRes.body.progress.length, 2);
});

test('PUT /claims/:claimNumber/status requires status field', async () => {
  const postRes = await request(app)
    .post('/claims')
    .send({ type: 'health', customerName: 'Maya', incidentDate: '2025-01-10' })
    .expect(201);

  const { claimNumber } = postRes.body;
  await request(app)
    .put(`/claims/${claimNumber}/status`)
    .send({})
    .expect(400);
});
