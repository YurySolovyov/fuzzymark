import { describe, it, expect } from 'vitest';

import highlighter from '../src/frontend/match-highlighter.js';

const wrapHighlight = (letter) => `(${letter})`;

const partial =
  (cb, ...initial) =>
  (...rest) =>
    cb(...initial, ...rest);

describe('match-highlighter', () => {
  it('highlights with one tag full equal string', function () {
    const highlight = partial(highlighter, {
      match: () => [0, 1, 2],
      reduce: () => [[0, 1, 2]],
      wrap: wrapHighlight,
    });

    expect(highlight('abc', 'abc')).toBe('(abc)');
  });

  it('highlights with one tag consecutive letters', function () {
    const highlight = partial(highlighter, {
      match: () => [1, 2],
      reduce: () => [[1, 2]],
      wrap: wrapHighlight,
    });

    expect(highlight('bc', 'abcd')).toBe('a(bc)d');
  });

  it('highlights last letters if it match', function () {
    const highlight = partial(highlighter, {
      match: () => [2, 3],
      reduce: () => [[2, 3]],
      wrap: wrapHighlight,
    });

    expect(highlight('cd', 'abcd')).toBe('ab(cd)');
  });

  it('highlights first letters if it match', function () {
    const highlight = partial(highlighter, {
      match: () => [0, 1],
      reduce: () => [[0, 1]],
      wrap: wrapHighlight,
    });

    expect(highlight('ab', 'abcd')).toBe('(ab)cd');
  });

  it('highlights one letter if it match', function () {
    const highlight = partial(highlighter, {
      match: () => [1],
      reduce: () => [[1]],
      wrap: wrapHighlight,
    });

    expect(highlight('b', 'abcd')).toBe('a(b)cd');
  });

  it('highlights one letter if it match at begin of string', function () {
    const highlight = partial(highlighter, {
      match: () => [0],
      reduce: () => [[0]],
      wrap: wrapHighlight,
    });

    expect(highlight('a', 'abcd')).toBe('(a)bcd');
  });

  it('highlights one letter if it match at end of string', function () {
    const highlight = partial(highlighter, {
      match: () => [3],
      reduce: () => [[3]],
      wrap: wrapHighlight,
    });

    expect(highlight('d', 'abcd')).toBe('abc(d)');
  });

  it('highlights multiple matches with break in matching', function () {
    const highlight = partial(highlighter, {
      match: () => [0, 1, 2, 7],
      reduce: () => [[0, 1, 2], [7]],
      wrap: wrapHighlight,
    });

    expect(highlight('habb', 'habrahabr')).toBe('(hab)ra(hab)r');
  });
});
