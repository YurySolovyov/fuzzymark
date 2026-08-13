import chromeUrls from './chrome-urls.js';
import faviconUrl from './favicon-url.js';
import browser from './browser.js';
import { getDisplayBookmarkUrl, parseStoredUrl } from '../../shared/bookmark-url.js';

const bookmarksBarId = '1';
const rootIndex = 0;

const getRawBookmarks = () => new Promise((resolve) => chrome.bookmarks.getTree(resolve));

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

const processRawBookmarks = (raw) => flattenBookmarks(raw, [], []);

const filterSeparators = (list) =>
  list.filter((bookmark) => {
    const isSeparator = bookmark.type && bookmark.type === 'separator';

    return !isSeparator;
  });

const simplifyBookmarks = (list, settings) => {
  const propertyKey = settings.propertyKey;
  const bookmarks = settings.showChromeUrls ? list.concat(chromeUrls) : list;
  const kind = browser();

  return bookmarks.map((bookmark) => {
    const [valid, url] = parseStoredUrl(bookmark.url);
    const displayUrl = valid ? getDisplayBookmarkUrl(url) : bookmark.url;

    return {
      ...bookmark,
      title: bookmark[propertyKey] || displayUrl,
      url: valid ? url : bookmark.url,
      favicon: valid ? faviconUrl(url, kind) : '',
      valid,
    };
  });
};

const transform = (rawBookmarks, settings) => {
  return simplifyBookmarks(filterSeparators(processRawBookmarks(rawBookmarks)), settings);
};

const load = getRawBookmarks;

const remove = (id, callback) => {
  chrome.bookmarks.remove(id.toString(), callback);
};

export default {
  transform,
  load,
  remove,
};
