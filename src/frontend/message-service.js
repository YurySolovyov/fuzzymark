import EventEmitter from 'eventemitter3';
const emitter = new EventEmitter();

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  emitter.emit(request.type, request);
  return true;
});

const on = (name, handler) => {
  emitter.on(name, handler);
};

const send = (type, message) => {
  return new Promise((resolve, _reject) => {
    chrome.runtime.sendMessage({ type, message }, resolve);
  });
};

export default {
  on,
  send,
};
