import { test } from 'uvu';
import * as assert from 'uvu/assert';

import reduce from '../src/frontend/ranges-reducer.js';

test('leaves non-ranged indexes as is', () => {
  const reduced = reduce([2, 4, 9]);
  assert.equal(reduced, [[2], [4], [9]]);
});

test('leaves single-index range as is', () => {
  const reduced = reduce([2]);
  assert.equal(reduced, [[2]]);
});

test('leaves continious range as is', () => {
  const reduced = reduce([0, 1, 2, 3, 4, 5]);
  assert.equal(reduced, [[0, 1, 2, 3, 4, 5]]);
});

test('reduces range at the beginning', () => {
  const reduced = reduce([0, 1, 2, 3, 7]);
  assert.equal(reduced, [[0, 1, 2, 3], [7]]);
});

test('reduces range at the end', () => {
  const reduced = reduce([0, 7, 8, 9, 10]);
  assert.equal(reduced, [[0], [7, 8, 9, 10]]);
});

test('reduces range in center', () => {
  const reduced = reduce([0, 7, 8, 9, 11]);
  assert.equal(reduced, [[0], [7, 8, 9], [11]]);
});

test('reduces ranges on the ends', () => {
  const reduced = reduce([0, 1, 2, 3, 8, 10, 11, 12, 13]);
  assert.equal(reduced, [[0, 1, 2, 3], [8], [10, 11, 12, 13]]);
});

test.run();