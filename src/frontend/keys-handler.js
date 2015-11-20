'use strict';

let keyHandlers = new Map();

const prepareKey = function(key) {
    return JSON.stringify(key);
};

module.exports = {
    getAction: function(key) {
        return keyHandlers.get(prepareKey(key));
    },

    hasShortcut: function(key) {
        return keyHandlers.has(prepareKey(key));
    },

    setShortcut: function(key, value) {
        return keyHandlers.set(prepareKey(key), value);
    },

    setMapping: function(map) {
        keyHandlers = map;
    },

    getMapping: function() {
        return keyHandlers;
    }
};
