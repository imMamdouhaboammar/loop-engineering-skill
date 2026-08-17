import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRun } from '../scripts/check-run.mjs';

function run(events, config = {}) {
  return validateRun({ config, events });
}

test('accepts a bounded maker/checker run with fresh verification', () => {
  const result = run([
    { type: 'reproduction', result: 'fail', iteration: 0 },
    { type: 'mutation', actor: 'maker', iteration: 1 },
    { type: 'verification', actor: 'checker', result: 'pass', iteration: 1 },
    { type: 'completion', iteration: 1 },
  ], { maxIterations: 5, requireFailingReproduction: true });

  assert.equal(result.ok, true);
});

test('rejects iteration overflow', () => {
  const result = run([
    { type: 'mutation', actor: 'maker', iteration: 6 },
  ], { maxIterations: 5 });

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /exceeds configured maximum/);
});

test('rejects completion after a failed verification', () => {
  const result = run([
    { type: 'mutation', actor: 'maker', iteration: 1 },
    { type: 'verification', actor: 'checker', result: 'fail', iteration: 1 },
    { type: 'completion', iteration: 1 },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /latest verification result to be 'pass'/);
});

test('rejects stale verification after a later mutation', () => {
  const result = run([
    { type: 'mutation', actor: 'maker', iteration: 1 },
    { type: 'verification', actor: 'checker', result: 'pass', iteration: 1 },
    { type: 'mutation', actor: 'maker', iteration: 2 },
    { type: 'completion', iteration: 2 },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /fresh verification after the latest mutation/);
});

test('rejects checker self-approval', () => {
  const result = run([
    { type: 'mutation', actor: 'same-agent', iteration: 1 },
    { type: 'verification', actor: 'same-agent', result: 'pass', iteration: 1 },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /checker must be independent/);
});

test('rejects a patch before required failing reproduction', () => {
  const result = run([
    { type: 'mutation', actor: 'maker', iteration: 1 },
  ], { requireFailingReproduction: true });

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /before a confirmed failing reproduction/);
});

test('rejects the same failed strategy three times', () => {
  const result = run([
    { type: 'failure', signature: 'unit:test-a', strategy: 'patch-a', iteration: 1 },
    { type: 'failure', signature: 'unit:test-a', strategy: 'patch-a', iteration: 2 },
    { type: 'failure', signature: 'unit:test-a', strategy: 'patch-a', iteration: 3 },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /repeated 3 times without a strategy change/);
});

test('allows repeated failure after strategy changes', () => {
  const result = run([
    { type: 'failure', signature: 'unit:test-a', strategy: 'patch-a', iteration: 1 },
    { type: 'failure', signature: 'unit:test-a', strategy: 'patch-a', iteration: 2 },
    { type: 'failure', signature: 'unit:test-a', strategy: 'diagnose-env', iteration: 3 },
  ]);

  assert.equal(result.ok, true);
});

test('rejects work after budget exhaustion', () => {
  const result = run([
    { type: 'budget_exhausted', iteration: 2 },
    { type: 'mutation', actor: 'maker', iteration: 3 },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /occurred after terminal event/);
});

test('rejects work after timeout', () => {
  const result = run([
    { type: 'timeout', iteration: 2 },
    { type: 'verification', actor: 'checker', result: 'pass', iteration: 2 },
  ]);

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /occurred after terminal event/);
});
