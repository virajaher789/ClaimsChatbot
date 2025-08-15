const test = require('node:test');
const assert = require('node:assert');

const { generateClaimNumber } = require('./utils');

test('generateClaimNumber produces prefixed string', () => {
  const claimNumber = generateClaimNumber();
  assert.match(claimNumber, /^CLM[0-9A-F]+$/);
});
