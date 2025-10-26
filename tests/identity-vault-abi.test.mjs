import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const abiPath = resolve(__dirname, 'frontend/src/contracts/FHEIdentityVault.json');
const abi = JSON.parse(await readFile(abiPath, 'utf8'));

const functionNames = abi
  .filter((item) => item.type === 'function')
  .map((item) => item.name);

const expectedFunctions = [
  'createIdentity',
  'updateIdentity',
  'hasIdentity',
  'getPlaintextData',
  'getEncryptedNetWorth',
  'calculateAccessLevel',
];

test('FHEIdentityVault ABI exposes expected entry points', () => {
  for (const name of expectedFunctions) {
    assert.ok(
      functionNames.includes(name),
      `Expected function "${name}" to exist in FHEIdentityVault ABI`
    );
  }
});

const identityEvents = abi.filter((item) => item.type === 'event').map((item) => item.name);

test('FHEIdentityVault ABI declares lifecycle events', () => {
  assert.deepEqual(
    identityEvents.sort(),
    ['IdentityCreated', 'IdentityUpdated'].sort()
  );
});
