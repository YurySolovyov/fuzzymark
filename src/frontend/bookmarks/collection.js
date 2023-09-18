import chromeUrls from './chrome-urls.js';
import faviconUrl from './favicon-url.js';
import browser from './browser.js';

const bookmarksBarId = '1';
const rootIndex = 0;

const getRawBookmarks = () => new Promise(resolve => chrome.bookmarks.getTree(resolve));

const handlePath = (treeNode, path) => {
  const isInFolder = treeNode.id !== bookmarksBarId && treeNode.index !== rootIndex;
  if (treeNode.title && isInFolder) {
    path.push(treeNode.title);
  }
};

const flattenBookmarks = (rawBookmarks, list, path) => {
  const reduced = rawBookmarks.reduce((bookmarks, treeNode) => {
    if (treeNode.children) {
      handlePath(treeNode, path);
      return bookmarks.concat(flattenBookmarks(treeNode.children, [], path));
    }
    
    treeNode.path = path.join('/');
    
    return bookmarks.concat(treeNode);
  }, list);
  
  path.pop();
  
  return reduced;
};

const processRawBookmarks = raw => flattenBookmarks(raw, [], []);

const filterInvalidBookmarks = list => list.filter(bookmark => {
  const isSeparator = bookmark.type && bookmark.type === 'separator';
  const url = new URL(bookmark.url);
  return !isSeparator && url.host !== '';
});

const simplifyBookmarks = (list, settings) => {
  const propertyKey = settings.propertyKey;
  const bookmarks = settings.showChromeUrls ? list.concat(chromeUrls) : list;
  const kind = browser();
  
  return bookmarks.map(bookmark => {
    return {
      ...bookmark,
      title: bookmark[propertyKey] || getSimplifiedUrl(bookmark.url),
      favicon: faviconUrl(bookmark.url, kind)
    };
  });
};

const getSimplifiedUrl = url => {
  const obj = new URL(url);
  return obj.host + (obj.pathname.length > 1 ? obj.pathname : '');
};

const transform = (rawBookmarks, settings) => {
  return simplifyBookmarks(filterInvalidBookmarks(processRawBookmarks(rawBookmarks)), settings);
};

const load = getRawBookmarks;

const remove = (id, callback) => {
  chrome.bookmarks.remove(id.toString(), callback);
};

export default {
  transform,
  load,
  remove
};
