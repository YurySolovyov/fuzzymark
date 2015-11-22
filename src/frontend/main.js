const $ = require('jquery');
const _ = require('lodash');
const FuzzaldrinPlus = require('fuzzaldrin-plus');
const Mustache = require('mustache');

$(function() {
    'use strict';

    const ViewportWatcher = require('./viewport-watcher.js');
    const keyHandlers = require('./keys-handler.js');

    const results = $('#results');
    const input = $('#input');

    const upKey = 38;
    const downKey = 40;
    const enterKey = 13;
    const escKey = 27;
    const deleteKey = 46;

    const store = new Map();

    const highlight = _.partial(require('./match-highlighter.js'), {
        match: FuzzaldrinPlus.match,
        reduce: require('./ranges-reducer.js'),
        wrap: (string) => '<b>' + string + '</b>'
    });

    const settings = { maxResults: 20, propertyKey: 'title' };

    const requestBackground = function(args) {
        return new Promise(function(resolve, _reject) {
            chrome.runtime.sendMessage(args, resolve);
        });
    };

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
        return flatBookmarks.map(function(bookmark) {
            return {
                id: bookmark.id,
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
            const wrappedTitle = highlight(value, title);
            return {
                id: item.id,
                selected: index === 0,
                score: score,
                title: wrappedTitle,
                url: item.url,
                favicon: item.favicon
            };
        });

        const renderedTemplates = renderBookmarks({
            bookmarks: bookmarks
        });

        results.html(renderedTemplates);
    };

    const clearResults = function() {
        results.empty();
        input.val('');
    };

    const loadTemplates = function() {
        Promise.all([
            $.get('templates/bookmarks.html'),
            $.get('templates/styles.html')
        ]).then(function(templates) {
            store.set('bookmarksTemplate', templates[0]);
            store.set('stylesTemplate', templates[1]);
        });
    };

    const renderBookmarks = function(data) {
        const template = store.get('bookmarksTemplate');
        return Mustache.to_html(template, data);
    };

    const selectNeededBookmark = function(direction, corner) {
        const selected = results.find('.selected');
        let needed = selected[direction]();
        if (needed.length === 0) {
            needed = selected[corner]();
        }

        if (needed.is(selected)) { return; }

        selected.removeClass('selected');
        needed.addClass('selected');
        ViewportWatcher.ensureInViewport(results, needed);
    };

    const selectNext = function() {
        selectNeededBookmark('next', 'first');
    };

    const selectPrev = function() {
        selectNeededBookmark('prev', 'last');
    };

    const openSelected = function() {
        const url = results.find('.selected .bookmarkUrl').text();
        return requestBackground({
            type: 'open_tab',
            url: url
        }).then(clearResults);
    };

    const removeBookmark = function() {
        const bookmark = results.find('.selected');
        const id = bookmark.data('id');
        chrome.bookmarks.remove(id.toString(), function() {
            selectNext();
            bookmark.remove();
            loadBookmarks();
        });
    };

    const dismiss = function() {
        clearResults();
    };

    const renderStyles = function() {
        const stylesTemplate = store.get('stylesTemplate');
        const styles = Mustache.to_html(stylesTemplate, {
            styles: settings.styleCss
        });
        $('head').append(styles);
    };

    const loadSettings = function() {
        return requestBackground({
            type: 'settings'
        }).then(function(response) {
            Object.assign(settings, response);
            renderStyles();
        });
    };

    const loadBookmarks = function() {
        getRawBookmarks().then(flattenBookmarks).then(simplifyBookmarks).then(setBookmarks);
    };

    input.on('input', function(e) {
        store.set('value', e.target.value);
        render();
    }).on('keydown', function(e) {
        const shortcut = {
            key: e.keyCode,
            alt: e.altKey,
            ctrl: e.ctrlKey,
            shift: e.shiftKey
        };

        if (keyHandlers.hasShortcut(shortcut)) {
            e.preventDefault();
            keyHandlers.getAction(shortcut)();
        }
    });

    keyHandlers.setShortcut({ key: upKey,     alt: false, ctrl: false, shift: false }, selectPrev);
    keyHandlers.setShortcut({ key: downKey,   alt: false, ctrl: false, shift: false }, selectNext);
    keyHandlers.setShortcut({ key: enterKey,  alt: false, ctrl: false, shift: false }, openSelected);
    keyHandlers.setShortcut({ key: escKey,    alt: false, ctrl: false, shift: false }, dismiss);
    keyHandlers.setShortcut({ key: deleteKey, alt: false, ctrl: false, shift: true },  removeBookmark);

    loadBookmarks();
    loadTemplates();
    loadSettings();
    input.focus();
});
