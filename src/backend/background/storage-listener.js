'use strict';

module.exports = function() {
  chrome.runtime.sendMessage({ type: 'storage-changed' });
};
