const express = require('express');
const { generateClaimNumber } = require('./utils');

const app = express();
app.use(express.json());

// In-memory claim store
const claims = {};

// Submit a claim
app.post('/claims', (req, res) => {
  const { type, customerName, incidentDate } = req.body;
  if (!type || !customerName || !incidentDate) {
    return res.status(400).json({ error: 'type, customerName, and incidentDate are required' });
  }

  const claimNumber = generateClaimNumber();
  const newClaim = {
    claimNumber,
    type,
    status: 'submitted',
    customerName,
    incidentDate,
    estimatedCompletion: null,
    createdAt: new Date().toISOString(),
    progress: [
      {
        id: 'submitted',
        title: 'Claim Submitted',
        status: 'completed',
        date: new Date().toISOString(),
        description: `Your claim has been received and assigned number ${claimNumber}`
      }
    ]
  };

  claims[claimNumber] = newClaim;

  res.status(201).json(newClaim);
});

// Get claim status
app.get('/claims/:claimNumber', (req, res) => {
  const { claimNumber } = req.params;
  const claim = claims[claimNumber];
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  res.json(claim);
});

// Update claim status
app.put('/claims/:claimNumber/status', (req, res) => {
  const { claimNumber } = req.params;
  const { status, description, estimatedCompletion } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }
  const claim = claims[claimNumber];
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  claim.status = status;
  if (estimatedCompletion) {
    claim.estimatedCompletion = estimatedCompletion;
  }
  claim.progress.push({
    id: status,
    title: status,
    status: 'completed',
    date: new Date().toISOString(),
    description: description || ''
  });
  res.json(claim);
});

function resetClaims() {
  for (const key of Object.keys(claims)) {
    delete claims[key];
  }
}

module.exports = { app, resetClaims };
