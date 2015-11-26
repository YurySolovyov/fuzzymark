const $ = require('jquery');
const Mustache = require('mustache');

$(function() {
    'use strict';

    const ViewportWatcher = require('./viewport-watcher.js');
    const keyHandlers = require('./keys-handler.js');
    const handleBackgroundMessages = require('./message-handler.js');

    const results = $('#results');
    const input = $('#input');
    const customStyles = $('#styles');

    const upKey = 38;
    const downKey = 40;
    const enterKey = 13;
    const escKey = 27;
    const deleteKey = 46;

    const state = new Map();
    const templates = new Map();
    const settings = require('./settings.js');

    const matchedBookmarks = require('./bookmarks/matched.js');
    const recentBookmarks = require('./bookmarks/recent.js');
    const bookmarksCollection = require('./bookmarks/collection.js');

    const requestBackground = function(args) {
        return new Promise(function(resolve, _reject) {
            chrome.runtime.sendMessage(args, resolve);
        });
    };

    const setBookmarks = function(bookmarks) {
        state.set('bookmarks', bookmarks);
    };

    const render = function(bookmarks) {
        results.html(renderBookmarks({ bookmarks: bookmarks }));
    };

    const clearResults = function() {
        results.empty();
        input.val('');
    };

    const loadTemplates = function() {
        $.get('templates/bookmarks.html').then(function(bookmarksTemplate) {
            templates.set('bookmarksTemplate', bookmarksTemplate);
        });
    };

    const renderBookmarks = function(data) {
        const template = templates.get('bookmarksTemplate');
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
        bookmarksCollection.remove(id, function() {
            selectNext();
            bookmark.remove();
            loadBookmarks();
        });
    };

    const dismiss = function() {
        clearResults();
    };

    const renderStyles = function() {
        customStyles.html(settings.get('styleCss'));
    };

    const loadSettings = function() {
        return requestBackground({
            type: 'settings'
        }).then(function(response) {
            Object.keys(response).forEach((key) => { settings.set(key, response[key]); });
            renderStyles();
            const bookmarks = recentBookmarks.filter(state.get('bookmarks'));
            render(bookmarks, recentBookmarks.wrap);
        });
    };

    const loadBookmarks = function() {
        bookmarksCollection.load().then(setBookmarks);
    };

    input.on('input', function(e) {
        state.set('value', e.target.value);
        const bookmarks = matchedBookmarks.filter(state.get('bookmarks'), state.get('value'));
        render(bookmarks, matchedBookmarks.wrap);
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

    handleBackgroundMessages({
        set_setting: loadSettings,
        focus: input.focus.bind(input)
    });

    keyHandlers.setShortcut({ key: upKey,     alt: false, ctrl: false, shift: false }, selectPrev);
    keyHandlers.setShortcut({ key: downKey,   alt: false, ctrl: false, shift: false }, selectNext);
    keyHandlers.setShortcut({ key: enterKey,  alt: false, ctrl: false, shift: false }, openSelected);
    keyHandlers.setShortcut({ key: escKey,    alt: false, ctrl: false, shift: false }, dismiss);
    keyHandlers.setShortcut({ key: deleteKey, alt: false, ctrl: false, shift: true  }, removeBookmark);

    loadBookmarks();
    loadTemplates();
    loadSettings();
    input.focus();
});
