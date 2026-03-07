import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateExtraComplementCents,
  EXTRA_COMPLEMENT_CENTS,
  getChargedComplementCount,
  getFreeComplementLimit,
} from "./acaiPricing.js";

test("small acai sizes have 3 free complements", () => {
  assert.equal(getFreeComplementLimit(150), 3);
  assert.equal(getFreeComplementLimit(200), 3);
  assert.equal(getFreeComplementLimit(300), 3);
});

test("larger or unknown sizes have 4 free complements", () => {
  assert.equal(getFreeComplementLimit(500), 4);
  assert.equal(getFreeComplementLimit(700), 4);
  assert.equal(getFreeComplementLimit(null), 4);
});

test("charged complements and extra value are calculated correctly", () => {
  assert.equal(getChargedComplementCount(2, 3), 0);
  assert.equal(getChargedComplementCount(3, 3), 0);
  assert.equal(getChargedComplementCount(5, 3), 2);
  assert.equal(calculateExtraComplementCents(5, 3), 2 * EXTRA_COMPLEMENT_CENTS);
});
