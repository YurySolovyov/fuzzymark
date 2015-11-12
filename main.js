$(function() {
    'use strict';

    const results = $('#results');
    const input = $('#input');

    const upKey = 38;
    const downKey = 40;
    const enterKey = 13;

    const store = new Map();
    const keyHandlers = new Map();

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
        const matched = Fuzzaldrin.filter(bookmarks, value, { key: 'title' });

        results.empty();

        const elements = matched.slice(0, 20).map(function(item, index) {
            const rootClasses = index === 0 ? 'bookmark selected' : 'bookmark';
            const root = $('<li />').addClass(rootClasses);
            const title = $('<span class="bookmarkTitle" />').text(item.title || item.url);
            const url = $('<span class="bookmarkUrl" />').text(item.url);

            return root.append(title, url);
        });

        results.append(elements);
    };

    const selectNext = function() {
        const selected = results.find('.selected');
        let next = selected.removeClass('selected').next();
        if (next.length === 0) {
            next = selected.first();
        }
        next.addClass('selected');
    };

    const selectPrev = function() {
        const selected = results.find('.selected');
        let prev = selected.removeClass('selected').prev();
        if (prev.length === 0) {
            prev = selected.last();
        }
        prev.addClass('selected');
    };

    const openSelected = function() {
        const url = results.find('.selected .bookmarkUrl').text();
        chrome.runtime.sendMessage({
            type: 'open_tab',
            url: url
        });
    };

    getRawBookmarks().then(flattenBookmarks).then(function(bookmarks) {
        store.set('bookmarks', bookmarks);
    });

    input.on('input', function(e) {
        store.set('value', e.target.value);
        render();
    }).on('keydown', function(e) {
        if (keyHandlers.has(e.keyCode)) {
            keyHandlers.get(e.keyCode)();
        }
    });

    keyHandlers.set(upKey, selectPrev);
    keyHandlers.set(downKey, selectNext);
    keyHandlers.set(enterKey, openSelected);

    $('#input').focus();
});
