'use strict';

let keyHandlers = new Map();

const prepareKey = JSON.stringify;

const getAction =  function(key) {
    return keyHandlers.get(prepareKey(key));
};

const hasShortcut = function(key) {
    return keyHandlers.has(prepareKey(key));
};

const setShortcut = function(key, value) {
    return keyHandlers.set(prepareKey(key), value);
};

const setMapping = function(map) {
    keyHandlers = map;
};

const getMapping = function() {
    return keyHandlers;
};

module.exports = {
    getAction,
    hasShortcut,
    setShortcut,
    setMapping,
    getMapping
};
