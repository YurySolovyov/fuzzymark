$(function() {
    'use strict';

    const results = $('#results');
    const input = $('#input');

    const upKey = 38;
    const downKey = 40;
    const enterKey = 13;
    const escKey = 27;

    const maxResults = 20;
    const propertyKey = 'title';

    const store = new Map();
    const keyHandlers = new Map();

    const highlighter = new MatchHighlighter;

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

    const simplifyBookmarks = function(flatBookmarks) {
        return flatBookmarks.map(function(bookmark) {
            return {
                title: bookmark.title || getSimplifiedUrl(bookmark.url),
                url: bookmark.url,
                favicon: 'chrome://favicon/' + bookmark.url
            };
        });
    };

    const setBookmarks = function(bookmarks) {
        store.set('bookmarks', bookmarks);
    };

    const getSimplifiedUrl = function(url) {
        const obj = new URL(url);
        return obj.host + (obj.pathname.length > 1 ? obj.pathname : '');
    };

    const render = function() {
        const bookmarks = store.get('bookmarks');
        const value = store.get('value');
        const matched = FuzzaldrinPlus.filter(bookmarks, value, {
            key: propertyKey,
            maxResults: maxResults
        });

        results.empty();

        const elements = matched.map(function(item, index) {
            const title = item.title;
            const score = FuzzaldrinPlus.score(title, value);
            const wrappedTitle = highlighter.highlight(value, title);
            return generateDom({
                selected: index === 0,
                score: score,
                title: wrappedTitle,
                url: item.url,
                favicon: item.favicon
            });
        });

        results.append(elements);
    };

    const clearResults = function() {
        results.empty();
        input.val('');
    };

    const generateDom = function(data) {
        const rootClasses = data.selected ? 'bookmark selected' : 'bookmark';
        const root = $('<li />').addClass(rootClasses);

        const bookmarkHeader = $('<span class="bookmarkHeader" />');
        const bookmarkFooter = $('<span class="bookmarkFooter" />');

        const scoreSpan = $('<span class="bookmarkScore" />').text(data.score);
        const titleSpan = $('<span class="bookmarkTitle" />').html(data.title);

        const faviconSpan = $('<img class="bookmarkFavicon" />').prop('src', data.favicon);
        const urlSpan = $('<a class="bookmarkUrl" />').prop('href', data.url).text(data.url);

        bookmarkHeader.append(scoreSpan, titleSpan);
        bookmarkFooter.append(faviconSpan, urlSpan);

        return root.append(bookmarkHeader, bookmarkFooter);
    }

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
        clearResults();
    };

    const dismiss = function() {
        clearResults();
    };

    getRawBookmarks().then(flattenBookmarks).then(simplifyBookmarks).then(setBookmarks);

    input.on('input', function(e) {
        store.set('value', e.target.value);
        render();
    }).on('keydown', function(e) {
        if (keyHandlers.has(e.keyCode)) {
            e.preventDefault();
            keyHandlers.get(e.keyCode)();
        }
    });

    keyHandlers.set(upKey, selectPrev);
    keyHandlers.set(downKey, selectNext);
    keyHandlers.set(enterKey, openSelected);
    keyHandlers.set(escKey, dismiss);

    input.focus();
});
