import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ballotAbiPath = resolve(__dirname, 'frontend/src/contracts/FHEBallot.json');
const quadraticAbiPath = resolve(__dirname, 'frontend/src/contracts/FHEQuadraticVoting.json');

const [ballotAbi, quadraticAbi] = await Promise.all([
  readFile(ballotAbiPath, 'utf8').then((src) => JSON.parse(src)),
  readFile(quadraticAbiPath, 'utf8').then((src) => JSON.parse(src)),
]);

const ballotFunctions = new Set(
  ballotAbi.filter((item) => item.type === 'function').map((item) => item.name)
);

const quadraticFunctions = new Set(
  quadraticAbi.filter((item) => item.type === 'function').map((item) => item.name)
);

test('FHEBallot exposes governance lifecycle entry points', () => {
  for (const name of ['createVoting', 'castVote', 'getVotingStatus', 'votingCounter']) {
    assert.ok(ballotFunctions.has(name), `Missing function ${name} in FHEBallot ABI`);
  }
});

const quadraticSuperset = ['castWeightedVote', 'castQuadraticVote'];

test('FHEQuadraticVoting extends ballot capabilities', () => {
  for (const name of quadraticSuperset) {
    assert.ok(
      quadraticFunctions.has(name),
      `Quadratic voting ABI should expose ${name}`
    );
  }
  for (const name of ['createVoting', 'castVote']) {
    assert.ok(quadraticFunctions.has(name), `Quadratic ABI missing base function ${name}`);
  }
});

const ballotEvents = ballotAbi.filter((item) => item.type === 'event').map((item) => item.name);

test('FHEBallot emits quorum and tally events', () => {
  assert.ok(ballotEvents.includes('VoteCast'), 'VoteCast event must exist');
  assert.ok(ballotEvents.includes('QuorumReached'), 'QuorumReached event must exist');
  assert.ok(ballotEvents.includes('VotingStatusChanged'), 'VotingStatusChanged event must exist');
});
