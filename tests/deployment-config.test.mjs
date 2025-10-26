import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, 'frontend/.env');
const envContents = await readFile(envPath, 'utf8');

const addressRegex = /^VITE_(?:IDENTITY_VAULT|BALLOT|QUADRATIC_VOTING)_ADDRESS=(0x[a-fA-F0-9]{40})$/gm;
const addresses = {};
let match;
while ((match = addressRegex.exec(envContents)) !== null) {
  addresses[match[0].split('=')[0]] = match[1];
}

const requiredKeys = [
  'VITE_IDENTITY_VAULT_ADDRESS',
  'VITE_BALLOT_ADDRESS',
  'VITE_QUADRATIC_VOTING_ADDRESS',
];

test('Deployment .env contains all FHE contract addresses', () => {
  for (const key of requiredKeys) {
    assert.ok(key in addresses, `Missing ${key} in frontend/.env`);
    assert.equal(addresses[key].length, 42, `${key} must be a 42-char checksummed address`);
  }
});

test('Deployment .env uses distinct addresses per contract', () => {
  const unique = new Set(Object.values(addresses));
  assert.equal(unique.size, requiredKeys.length, 'Each contract address should be unique');
});

const chainIdMatch = envContents.match(/^VITE_CHAIN_ID=(\d+)$/m);

test('Deployment .env pins Sepolia chain ID', () => {
  assert.ok(chainIdMatch, 'VITE_CHAIN_ID must be defined');
  assert.equal(chainIdMatch[1], '11155111', 'Expected Sepolia chain id 11155111');
});
