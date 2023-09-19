import { test } from 'uvu';
import * as assert from 'uvu/assert';

import highlighter from '../src/frontend/match-highlighter.js';

const wrapHighlight = letter => `(${letter})`;

const partial = (cb, ...initial) => (...rest) => cb(...initial, ...rest);

test('highlights with one tag full equal string', function() {
  const highlight = partial(highlighter, {
    match: () => [ 0, 1, 2 ],
    reduce: () => [ [ 0, 1, 2 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('abc', 'abc'), '(abc)');
});

test('highlights with one tag consecutive letters', function() {
  const highlight = partial(highlighter, {
    match: () => [ 1, 2 ],
    reduce: () => [ [ 1, 2 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('bc', 'abcd'), 'a(bc)d');
});

test('highlights last letters if it match', function() {
  const highlight = partial(highlighter, {
    match: () => [ 2, 3 ],
    reduce: () => [ [ 2, 3 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('cd', 'abcd'), 'ab(cd)');
});

test('highlights first letters if it match', function() {
  const highlight = partial(highlighter, {
    match: () => [ 0, 1 ],
    reduce: () => [ [ 0, 1 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('ab', 'abcd'), '(ab)cd');
});

test('highlights one letter if it match', function() {
  const highlight = partial(highlighter, {
    match: () => [ 1 ],
    reduce: () => [ [ 1 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('b', 'abcd'), 'a(b)cd');
});

test('highlights one letter if it match at begin of string', function() {
  const highlight = partial(highlighter, {
    match: () => [ 0 ],
    reduce: () => [ [ 0 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('a', 'abcd'), '(a)bcd');
});

test('highlights one letter if it match at end of string', function() {
  const highlight = partial(highlighter, {
    match: () => [ 3 ],
    reduce: () => [ [ 3 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('d', 'abcd'), 'abc(d)');
});

test('highlights multiple matches with break in matching', function() {
  const highlight = partial(highlighter, {
    match: () => [ 0, 1, 2, 7 ],
    reduce: () => [ [0, 1, 2], [ 7 ] ],
    wrap: wrapHighlight
  });
  
  assert.is(highlight('habb', 'habrahabr'), '(hab)ra(hab)r');
});

test.run();
