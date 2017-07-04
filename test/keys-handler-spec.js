const keyHandlers = require('./../src/frontend/keys-handler.js');

describe('keyHandlers', function() {
  'use strict';

  it('has default map', function() {
    expect(keyHandlers.getMapping()).toBeDefined();
  });

  const mapping = new Map();
  beforeEach(function() {
    mapping.clear();
  });

  it('serialize shortuct before retrieving', function() {
    const action = 'action';
    mapping.set('{"a":1}', action);
    keyHandlers.setMapping(mapping);

    expect(keyHandlers.getAction({ a: 1 })).toEqual(action);
  });

  it('serialize shortuct before setting', function() {
    const action = 'action';
    keyHandlers.setMapping(mapping);
    keyHandlers.setShortcut({ a: 1 }, action);

    expect(mapping.get('{"a":1}')).toEqual(action);
  });

  it('serialize shortuct before cheking for entrance', function() {
    const action = 'action';
    mapping.set('{"a":1}', action);
    keyHandlers.setMapping(mapping);

    expect(keyHandlers.hasShortcut({ a: 1 })).toBe(true);
  });
});
