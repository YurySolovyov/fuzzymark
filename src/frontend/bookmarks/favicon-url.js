const isFirefox = typeof window.chrome !== 'undefined' && typeof browser !== 'undefined';

const chromeFavicon = address => {
  const origin = new URL(address).origin;
  
  if (!window.chrome) {
    return `${origin}/favicon.ico`;
  }
  
  const url = new URL(window.chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", origin);
  url.searchParams.set("size", "32");
  return url.toString();
}

export default (url) => {
  return isFirefox ? new URL(url).origin + '/favicon.ico' : chromeFavicon(url);
};
