const browsers = {
  'chrome-extension': 'chrome',
  'moz-extension': 'firefox',
};

export default () => {
  const protocol = chrome.runtime.getURL('').split('://')[0];
  return browsers[protocol];
};
