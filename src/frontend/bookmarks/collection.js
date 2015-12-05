'use strict';

const bookmarksBarId = '1';
const settings = require('./../settings.js');

const getRawBookmarks = function() {
    return new Promise(function(resolve, _reject) {
        chrome.bookmarks.getTree(resolve);
    });
};

const flattenBookmarks = function(rawBookmarks, list) {
    return rawBookmarks.reduce(function(arr, treeNode) {
        return arr.concat(treeNode.children ? flattenBookmarks(treeNode.children, []) : treeNode);
    }, list);
};

const flattenTree = function(rawBookmarks, tree) {
    return rawBookmarks.reduce(function(obj, treeNode) {
        if (treeNode.children) {
            obj[treeNode.id] = treeNode;
            return flattenTree(treeNode.children, obj);
        }
        return obj;
    }, tree);
};

const getPathUp = function(treeNode, map, path) {
    const parent = map[treeNode.parentId];
    if (parent.title && parent.id !== bookmarksBarId) {
        path.unshift(parent.title);
        return getPathUp(parent, map, path);
    }
    return path;
};

const buildMap = function(map) {
    return Object.keys(map).reduce(function(obj, key) {
        const treeNode = map[key];
        if (treeNode.parentId) {
            obj[key] = getPathUp(treeNode, map, [treeNode.title]).join('/');
        }
        return obj;
    }, {});
};

const processRawBookmarks = function(raw) {
    return {
        list: flattenBookmarks(raw, []),
        map: buildMap(flattenTree(raw, {}))
    };
};

const simplifyBookmarks = function(data) {
    const propertyKey = settings.store.get('propertyKey');
    return data.list.map(function(bookmark) {
        return Object.assign(bookmark, {
            path: data.map[bookmark.parentId],
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
