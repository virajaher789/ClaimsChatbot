const { v4: uuidv4 } = require('uuid');

function generateClaimNumber() {
  const unique = uuidv4().split('-')[0].toUpperCase();
  return `CLM${unique}`;
}

module.exports = { generateClaimNumber };
