'use strict';

const chromeUrls = require('./chrome-urls');
const bookmarksBarId = '1';
const rootIndex = 0;

const getRawBookmarks = function() {
  return new Promise(function(resolve, _reject) {
    chrome.bookmarks.getTree(resolve);
  });
};

const handlePath = function(treeNode, path) {
  const isInFolder = treeNode.id !== bookmarksBarId && treeNode.index !== rootIndex;
  if (treeNode.title && isInFolder) {
    path.push(treeNode.title);
  }
};

const flattenBookmarks = function(rawBookmarks, list, path) {
  const reduced = rawBookmarks.reduce(function(bookmarks, treeNode) {
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

const processRawBookmarks = function(raw) {
  return flattenBookmarks(raw, [], []);
};

const getFaviconUrl = function({ url }) {
  const isFirefox = typeof chrome !== 'undefined' && typeof browser !== 'undefined';
  return isFirefox ? new URL(url).origin + '/favicon.ico' : 'chrome://favicon/' + url;
};

const filterInvalidBookmarks = function(list) {
  const dummy = document.createElement('a');
  return list.filter(function(bookmark) {
    dummy.href = bookmark.url;
    return dummy.host !== '';
  });
};

const simplifyBookmarks = function(list, settings) {
  const propertyKey = settings.propertyKey;
  const bookmarks = settings.showChromeUrls ? list.concat(chromeUrls) : list;
  return bookmarks.map(function(bookmark) {
    return Object.assign(bookmark, {
      title: bookmark[propertyKey] || getSimplifiedUrl(bookmark.url),
      favicon: getFaviconUrl(bookmark)
    });
  });
};

const getSimplifiedUrl = function(url) {
  const obj = new URL(url);
  return obj.host + (obj.pathname.length > 1 ? obj.pathname : '');
};

const transform = function(rawBookmarks, settings) {
  return simplifyBookmarks(filterInvalidBookmarks(processRawBookmarks(rawBookmarks)), settings);
};

const load = function() {
  return getRawBookmarks();
};

const remove = function(id, callback) {
  chrome.bookmarks.remove(id.toString(), callback);
};

module.exports = {
  transform,
  load,
  remove
};
