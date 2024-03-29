import EventEmitter from 'eventemitter3';
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

export default {
  on,
  send
};
