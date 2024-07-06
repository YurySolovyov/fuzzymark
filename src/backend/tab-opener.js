export default (url, callback) => {
  chrome.tabs.query({ url: url }, function(tabs) {
    if (tabs && tabs.length) {
      chrome.tabs.update(tabs[0].id, { active: true });
      chrome.runtime.sendMessage({ type: 'focus' });
    } else {
      chrome.tabs.create({ url: url });
    }

    if (typeof callback === 'function') {
      callback();
    }
  });

  return true;
};
