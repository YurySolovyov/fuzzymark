const handlers = {
  chrome: (address) => {
    const url = new URL(globalThis.chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', address);
    url.searchParams.set('size', '32');
    return url.toString();
  },

  firefox: (address) => new URL(address).origin + '/favicon.ico',
};

export default (url, kind) => {
  const handler = handlers[kind];

  return handler(url);
};
