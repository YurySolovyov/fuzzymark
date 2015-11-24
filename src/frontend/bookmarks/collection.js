'use strict';

const settings = require('./../settings.js');

const getRawBookmarks = function() {
    return new Promise(function(resolve, _reject) {
        chrome.bookmarks.getTree(resolve);
    });
};

const flattenBookmarks = function(rawBookmarks) {
    return rawBookmarks.reduce(function(arr, treeNode) {
        return arr.concat(treeNode.children ? flattenBookmarks(treeNode.children) : treeNode);
    }, []);
};

const simplifyBookmarks = function(flatBookmarks) {
    const propertyKey = settings.get('propertyKey');
    return flatBookmarks.map(function(bookmark) {
        return {
            id: bookmark.id,
            title: bookmark[propertyKey] || getSimplifiedUrl(bookmark.url),
            url: bookmark.url,
            dateAdded: bookmark.dateAdded,
            favicon: 'chrome://favicon/' + bookmark.url
        };
    });
};

const getSimplifiedUrl = function(url) {
    const obj = new URL(url);
    return obj.host + (obj.pathname.length > 1 ? obj.pathname : '');
};

module.exports = {
    load: function() {
        return getRawBookmarks().then(flattenBookmarks).then(simplifyBookmarks);
    },
    remove: function(id, callback) {
        chrome.bookmarks.remove(id.toString(), callback);
    }
};
