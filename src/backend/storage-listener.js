export default () => chrome.runtime.sendMessage({ type: 'storage-changed' });
