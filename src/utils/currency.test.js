import test from "node:test";
import assert from "node:assert/strict";
import { formatCents, parseCurrencyToCents } from "./currency.js";

test("parseCurrencyToCents parses pt-BR currency strings", () => {
  assert.equal(parseCurrencyToCents("R$ 10,99"), 1099);
  assert.equal(parseCurrencyToCents("R$ 1.234,56"), 123456);
  assert.equal(parseCurrencyToCents("0"), 0);
});

test("parseCurrencyToCents handles numbers and invalid values", () => {
  assert.equal(parseCurrencyToCents(19.9), 1990);
  assert.equal(parseCurrencyToCents(undefined), 0);
  assert.equal(parseCurrencyToCents("abc"), 0);
});

test("formatCents formats cents to pt-BR currency", () => {
  assert.equal(formatCents(1099), "R$ 10,99");
  assert.equal(formatCents(0), "R$ 0,00");
});
