import { describe, expect, it } from 'vitest';

import chunk from '../src/frontend/chunk.js';

describe('chunk', () => {
  it('splits items into fixed-size groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('defaults to single-item groups', () => {
    expect(chunk([1, 2, 3])).toEqual([[1], [2], [3]]);
  });

  it('returns an empty array for empty input', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('returns an empty array for non-positive sizes', () => {
    expect(chunk([1, 2, 3], 0)).toEqual([]);
    expect(chunk([1, 2, 3], -2)).toEqual([]);
  });

  it('does not mutate the input array', () => {
    const items = [1, 2, 3, 4];

    chunk(items, 2);

    expect(items).toEqual([1, 2, 3, 4]);
  });
});
