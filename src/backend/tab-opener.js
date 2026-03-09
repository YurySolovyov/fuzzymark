import { parseStoredUrl } from '../shared/bookmark-url.js';

export default (url, callback) => {
  const [valid, normalizedUrl] = parseStoredUrl(url);

  if (!valid) {
    if (typeof callback === 'function') {
      callback({ status: false, valid: false });
    }

    return true;
  }

  chrome.tabs.query({ url: normalizedUrl }, function (tabs) {
    if (tabs && tabs.length) {
      chrome.tabs.update(tabs[0].id, { active: true });
      chrome.runtime.sendMessage({ type: 'focus' });
    } else {
      chrome.tabs.create({ url: normalizedUrl });
    }

    if (typeof callback === 'function') {
      callback({ status: true, valid: true });
    }
  });

  return true;
};
