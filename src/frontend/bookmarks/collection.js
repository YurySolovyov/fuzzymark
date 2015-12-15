'use strict';

const bookmarksBarId = '1';
const settings = require('./../settings.js');

const getRawBookmarks = function() {
    return new Promise(function(resolve, _reject) {
        chrome.bookmarks.getTree(resolve);
    });
};

const handlePath = function(treeNode, path) {
    if (treeNode.title && treeNode.id !== bookmarksBarId) {
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

const simplifyBookmarks = function(list) {
    const propertyKey = settings.store.get('propertyKey');
    return list.map(function(bookmark) {
        return Object.assign(bookmark, {
            title: bookmark[propertyKey] || getSimplifiedUrl(bookmark.url),
            favicon: 'chrome://favicon/' + bookmark.url
        });
    });
};

const getSimplifiedUrl = function(url) {
    const obj = new URL(url);
    return obj.host + (obj.pathname.length > 1 ? obj.pathname : '');
};

module.exports = {
    load: function() {
        return getRawBookmarks().then(processRawBookmarks).then(simplifyBookmarks);
    },
    remove: function(id, callback) {
        chrome.bookmarks.remove(id.toString(), callback);
    }
};
