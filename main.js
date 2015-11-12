$(function() {
    'use strict';

    const results = $('#results');
    const input = $('#input');

    const store = new Map();

    const getRawBookmarks = function() {
        return new Promise(function(resolve) {
            chrome.bookmarks.getTree(resolve);
        });
    };

    const flattenBookmarks = function(rawBookmarks) {
        return rawBookmarks.reduce(function(arr, treeNode) {
            return arr.concat(treeNode.children ? flattenBookmarks(treeNode.children) : treeNode);
        }, []);
    };

    const render = function() {
        const bookmarks = store.get('bookmarks');
        const value = store.get('value');
        const matched = Fuzzaldrin.filter(bookmarks, value, { key: 'url' });

        results.empty();

        const elements = matched.slice(0, 20).map(function(item, index) {
            const root = $('<li class="bookmark" />');
            const title = $('<span class="bookmarkTitle" />').text(item.title || item.url);
            const url = $('<span class="bookmarkUrl" />').text(item.url);

            return root.append(title, url);
        });

        results.append(elements);
    };

    getRawBookmarks().then(flattenBookmarks).then(function(bookmarks) {
        store.set('bookmarks', bookmarks);
    });

    input.on('input', function(e) {
        store.set('value', e.target.value);
        render();
    });

    $('#input').focus();
});
