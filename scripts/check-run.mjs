#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function validateRun(run) {
  const errors = [];
  const config = run?.config ?? {};
  const events = Array.isArray(run?.events) ? run.events : [];
  const hasConfiguredLimit = Object.hasOwn(config, 'maxIterations');
  const validConfiguredLimit = Number.isInteger(config.maxIterations) && config.maxIterations > 0;
  const maxIterations = hasConfiguredLimit && validConfiguredLimit ? config.maxIterations : 5;

  if (hasConfiguredLimit && !validConfiguredLimit) {
    errors.push('config: maxIterations must be a positive integer');
  }

  let latestMutationIndex = -1;
  let latestMutationActor = null;
  let latestVerificationIndex = -1;
  let latestVerificationResult = null;
  let terminalIndex = -1;
  let reproductionFailed = !config.requireFailingReproduction;
  const failureState = new Map();

  events.forEach((event, index) => {
    const iteration = event?.iteration;
    if (iteration != null && (!Number.isInteger(iteration) || iteration < 0 || iteration > maxIterations)) {
      errors.push(`event ${index}: iteration ${iteration} exceeds configured maximum ${maxIterations}`);
    }

    if (terminalIndex >= 0) {
      errors.push(`event ${index}: '${event?.type ?? 'unknown'}' occurred after terminal event at ${terminalIndex}`);
    }

    switch (event?.type) {
      case 'reproduction':
        if (event.result === 'fail') reproductionFailed = true;
        break;
      case 'mutation':
        if (!reproductionFailed) errors.push(`event ${index}: mutation occurred before a confirmed failing reproduction`);
        latestMutationIndex = index;
        latestMutationActor = event.actor ?? null;
        break;
      case 'verification':
        latestVerificationIndex = index;
        latestVerificationResult = event.result ?? null;
        if (!latestMutationActor) errors.push(`event ${index}: verification has no preceding mutation`);
        if (event.actor && latestMutationActor && event.actor === latestMutationActor) {
          errors.push(`event ${index}: checker must be independent from maker '${event.actor}'`);
        }
        break;
      case 'failure': {
        const signature = event.signature;
        if (!signature) break;
        const previous = failureState.get(signature) ?? { count: 0, strategy: event.strategy ?? null };
        const strategy = event.strategy ?? null;
        const sameStrategy = previous.strategy === strategy;
        const count = sameStrategy ? previous.count + 1 : 1;
        failureState.set(signature, { count, strategy });
        if (count >= 3) errors.push(`event ${index}: failure '${signature}' repeated ${count} times without a strategy change`);
        break;
      }
      case 'budget_exhausted':
      case 'timeout':
      case 'halted':
        terminalIndex = index;
        break;
      case 'completion':
        if (latestMutationIndex < 0) errors.push(`event ${index}: completion has no implementation mutation`);
        if (latestVerificationIndex < latestMutationIndex) errors.push(`event ${index}: completion requires fresh verification after the latest mutation`);
        if (latestVerificationResult !== 'pass') errors.push(`event ${index}: completion requires the latest verification result to be 'pass'`);
        break;
      default:
        break;
    }
  });

  return {
    ok: errors.length === 0,
    errors,
    summary: { eventCount: events.length, maxIterations, latestMutationIndex, latestVerificationIndex, latestVerificationResult },
  };
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node scripts/check-run.mjs <run.json>');
    process.exit(2);
  }
  let run;
  try {
    run = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(`Invalid run file: ${error.message}`);
    process.exit(2);
  }
  const result = validateRun(run);
  if (!result.ok) {
    console.error('Loop run invariant check failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Loop run invariant check passed (${result.summary.eventCount} events).`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
