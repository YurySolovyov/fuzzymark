const _ = require('lodash');
const highlighter = require('./../src/frontend/match-highlighter.js');

describe('matchHighlighter', function() {
  'use strict';

  const wrapHighlight = (letter) => { return '(' + letter + ')'; };

  it('highlights with one tag full equal string', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 0, 1, 2 ],
      reduce: () => [ [ 0, 1, 2 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('abc', 'abc')).toEqual('(abc)');
  });

  it('highlights with one tag consecutive letters', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 1, 2 ],
      reduce: () => [ [ 1, 2 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('bc', 'abcd')).toEqual('a(bc)d');
  });

  it('highlights last letters if it match', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 2, 3 ],
      reduce: () => [ [ 2, 3 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('cd', 'abcd')).toEqual('ab(cd)');
  });

  it('highlights first letters if it match', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 0, 1 ],
      reduce: () => [ [ 0, 1 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('ab', 'abcd')).toEqual('(ab)cd');
  });

  it('highlights one letter if it match', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 1 ],
      reduce: () => [ [ 1 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('b', 'abcd')).toEqual('a(b)cd');
  });

  it('highlights one letter if it match at begin of string', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 0 ],
      reduce: () => [ [ 0 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('a', 'abcd')).toEqual('(a)bcd');
  });

  it('highlights one letter if it match at end of string', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 3 ],
      reduce: () => [ [ 3 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('d', 'abcd')).toEqual('abc(d)');
  });

  it('highlights multiple matches with break in matching', function() {
    const highlight = _.partial(highlighter, {
      match: () => [ 0, 1, 2, 7 ],
      reduce: () => [ [0, 1, 2], [ 7 ] ],
      wrap: wrapHighlight
    });
    expect(highlight('habb', 'habrahabr')).toEqual('(hab)ra(hab)r');
  });
});
