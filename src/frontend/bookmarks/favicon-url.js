const isFirefox = typeof chrome !== 'undefined' && typeof browser !== 'undefined';

const chromeFavicon = of => {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", of);
  url.searchParams.set("size", "32");
  return url.toString();
}

export default (url) => {
  return isFirefox ? new URL(url).origin + '/favicon.ico' : chromeFavicon(url);
};
