'use strict';

const listen = function(handlers) {
  chrome.runtime.onMessage.addListener(function(request, _sender, _sendResponse) {
    const handler = handlers[request.type];
    if (typeof handler === 'function') {
      handler();
    }
    return true;
  });
};

const send = function(message) {
  return new Promise(function(resolve, _reject) {
    chrome.runtime.sendMessage(message, resolve);
  });
};

module.exports = {
  listen,
  send
};
