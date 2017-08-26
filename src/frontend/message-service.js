'use strict';

const EventEmitter = require('events');
const emitter = new EventEmitter();

chrome.runtime.onMessage.addListener(function(request, _sender, _sendResponse) {
  emitter.emit(request.type);
  return true;
});

const on = function(name, handler) {
  emitter.on(name, handler);
};

const send = function(type, message) {
  return new Promise(function(resolve, _reject) {
    chrome.runtime.sendMessage({ type, message }, resolve);
  });
};

module.exports = {
  on,
  send
};
