import { describe, it, expect } from 'vitest';

import reduce from '../src/frontend/ranges-reducer.js';

describe('ranges-reducer', () => {
  it('leaves non-ranged indexes as is', () => {
    const reduced = reduce([2, 4, 9]);
    expect(reduced).toEqual([[2], [4], [9]]);
  });

  it('leaves single-index range as is', () => {
    const reduced = reduce([2]);
    expect(reduced).toEqual([[2]]);
  });

  it('leaves continious range as is', () => {
    const reduced = reduce([0, 1, 2, 3, 4, 5]);
    expect(reduced).toEqual([[0, 1, 2, 3, 4, 5]]);
  });

  it('reduces range at the beginning', () => {
    const reduced = reduce([0, 1, 2, 3, 7]);
    expect(reduced).toEqual([[0, 1, 2, 3], [7]]);
  });

  it('reduces range at the end', () => {
    const reduced = reduce([0, 7, 8, 9, 10]);
    expect(reduced).toEqual([[0], [7, 8, 9, 10]]);
  });

  it('reduces range in center', () => {
    const reduced = reduce([0, 7, 8, 9, 11]);
    expect(reduced).toEqual([[0], [7, 8, 9], [11]]);
  });

  it('reduces ranges on the ends', () => {
    const reduced = reduce([0, 1, 2, 3, 8, 10, 11, 12, 13]);
    expect(reduced).toEqual([[0, 1, 2, 3], [8], [10, 11, 12, 13]]);
  });
});
