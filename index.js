const express = require('express');
const { generateClaimNumber } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

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
    createdAt: new Date().toISOString()
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

app.listen(PORT, () => {
  console.log(`ClaimsCompanion API running on port ${PORT}`);
});
