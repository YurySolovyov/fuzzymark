const $ = require('jquery');
const Mustache = require('mustache');

$(function() {
    'use strict';

    const viewportWatcher = require('./viewport-watcher');
    const keyHandlers = require('./keys-handler');
    const messageService = require('./message-service');
    const togglePair = require('./toggle-pair');
    const alerts = require('./alerts.js');

    const matchedBookmarks = require('./bookmarks/matched');
    const recentBookmarks = require('./bookmarks/recent');
    const bookmarksCollection = require('./bookmarks/collection');

    const settings = require('./settings');
    const options = require('./options');

    const results = $('#results');
    const input = $('#input');
    const customStyles = $('#styles');

    const settingsContainer = $('#settings');
    const settingsButton = $('#settingsButton');

    const upKey = 38;
    const downKey = 40;
    const enterKey = 13;
    const escKey = 27;
    const deleteKey = 46;

    const state = new Map();
    const templates = new Map();

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
        viewportWatcher.ensureInViewport(results, needed);
    };

    const selectNext = function() {
        selectNeededBookmark('next', 'first');
    };

    const selectPrev = function() {
        selectNeededBookmark('prev', 'last');
    };

    const openSelected = function() {
        const url = results.find('.selected .bookmarkUrl').text();
        return messageService.send({
            type: 'open_tab',
            url: url
        }).then(clearResults);
    };

    const removeBookmark = function() {
        alerts.confirmate('Are you sure? You will not be able to recover this bookmark!', function(result) {
            if (result) {
                const bookmark = results.find('.selected');
                const id = bookmark.data('id');
                bookmarksCollection.remove(id, function() {
                    selectNext();
                    bookmark.remove();
                    loadBookmarks();
                });
            }
            input.focus();
        });
    };

    const dismiss = function() {
        clearResults();
    };

    const renderStyles = function() {
        customStyles.html(settings.get('styleCss'));
    };

    const loadSettings = function() {
        return messageService.send({
            type: 'settings'
        }).then(function(response) {
            Object.keys(response).forEach((key) => { settings.set(key, response[key]); });
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

    togglePair.connect(settingsButton, settingsContainer);

    options.init(settingsContainer);
    options.onChange(function(key, value) {
        settings.set(key, value);
        if (key === 'styleCss') {
            renderStyles();
        }
    });

    messageService.listen({
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
