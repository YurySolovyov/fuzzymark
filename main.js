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

    const render = function() {
        const bookmarks = store.get('bookmarks');
        const value = store.get('value');
        const matched = Fuzzaldrin.filter(bookmarks, value, {
            key: propertyKey,
            maxResults: maxResults
        });

        results.empty();

        const elements = matched.slice(0, 20).map(function(item, index) {
            const title = item.title || item.url;
            const score = Math.floor(Fuzzaldrin.score(title, value) * 100);
            const wrappedTitle = highlighter.call(value, title);
            return generateDom(index, {score: score, title: wrappedTitle, url: item.url});
        });

        results.append(elements);
    };

    const clearResults = function() {
        results.empty();
        input.val('');
    };

    const generateDom = function(index, infoValues) {
        const rootClasses = index === 0 ? 'bookmark selected' : 'bookmark';
        const root = $('<li />').addClass(rootClasses);

        const scoreInfo = $('<div class="bookmarkScoreInfo" />');
        const bookmarkInfo = $('<div class="bookmarkInfo" />');

        const scoreSpan = $('<span class="bookmarkScore" />').text(infoValues.score);
        const titleSpan = $('<span class="bookmarkTitle" />').html(infoValues.title);
        const urlSpan = $('<span class="bookmarkUrl" />').text(infoValues.url);

        bookmarkInfo.append(titleSpan, urlSpan)
        if (infoValues.score > 0) {
            scoreInfo.append(scoreSpan);
        }

        return root.append(scoreInfo, bookmarkInfo);
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

    getRawBookmarks().then(flattenBookmarks).then(function(bookmarks) {
        store.set('bookmarks', bookmarks);
    });

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
