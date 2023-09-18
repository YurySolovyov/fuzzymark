const handlers = {
  chrome: address => {
    const origin = new URL(address).origin;
    
    if (!globalThis.chrome) {
      return `${origin}/favicon.ico`;
    }
    
    const url = new URL(globalThis.chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", origin);
    url.searchParams.set("size", "32");
    return url.toString();

  },

  firefox: address => new URL(address).origin + '/favicon.ico'
};

export default (url, kind) => {
  const handler = handlers[kind];

  return handler(url);
};
