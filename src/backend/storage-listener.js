export default (changes) =>
  chrome.runtime.sendMessage({ type: 'storage-changed', keys: Object.keys(changes) });
