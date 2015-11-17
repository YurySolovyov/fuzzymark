$(function() {
    'use strict';

    const results = $('#results');
    const input = $('#input');

    const upKey = 38;
    const downKey = 40;
    const enterKey = 13;
    const escKey = 27;

    const store = new Map();
    const keyHandlers = new Map();

    const highlighter = new MatchHighlighter;
    const settings = { maxResults: 20, propertyKey: 'title' };

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
                title: bookmark[settings.propertyKey] || getSimplifiedUrl(bookmark.url),
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
        const value = store.get('value');
        const bookmarks = FuzzaldrinPlus.filter(store.get('bookmarks'), value, {
            key: settings.propertyKey,
            maxResults: settings.maxResults
        }).map(function(item, index) {
            const title = item[settings.propertyKey];
            const score = FuzzaldrinPlus.score(title, value);
            const wrappedTitle = highlighter.highlight(value, title);
            return {
                selected: index === 0,
                score: score,
                title: wrappedTitle,
                url: item.url,
                favicon: item.favicon
            };
        });

        const renderedTemplates = renderTemplates({
            bookmarks: bookmarks
        });

        results.html(renderedTemplates);
    };

    const clearResults = function() {
        results.empty();
        input.val('');
    };

    const loadTemplates = function() {
        $.get('templates/bookmarks.html').then(function(template) {
            store.set('template', template);
        });
    };

    const renderTemplates = function(data) {
        const template = store.get('template');
        return Mustache.to_html(template, data);
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
        clearResults();
    };

    const dismiss = function() {
        clearResults();
    };

    const renderStyles = function() {
        $('<style type="text/css" />)')
            .text(settings.styleCss)
            .appendTo('body');
    };

    const loadSettings = function() {
        chrome.runtime.sendMessage({
            type: 'settings'
        }, function(response) {
            Object.assign(settings, response);
            renderStyles();
        });
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

    loadTemplates();
    loadSettings();
    input.focus();
});
