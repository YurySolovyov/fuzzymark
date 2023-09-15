const isFirefox = typeof chrome !== 'undefined' && typeof browser !== 'undefined';

const chromeFavicon = address => {
  const origin = new URL(address).origin;
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", origin);
  url.searchParams.set("size", "32");
  return url.toString();
}

export default (url) => {
  return isFirefox ? new URL(url).origin + '/favicon.ico' : chromeFavicon(url);
};
