const on = (name, handler) => {
  const listener = (request) => {
    if (request.type === name) {
      handler(request);
    }
  };

  chrome.runtime.onMessage.addListener(listener);
  return () => chrome.runtime.onMessage.removeListener(listener);
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
