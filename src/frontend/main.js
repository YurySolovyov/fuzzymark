const $ = require('jquery');
const Mustache = require('mustache');

$(function() {
    'use strict';

    const viewportWatcher = require('./viewport-watcher');
    const keyHandlers = require('./keys-handler');
    const messageService = require('./message-service');
    const togglePair = require('./toggle-pair');
    const dialogs = require('./dialogs.js');
    const tabSwitcher = require('./tab-switcher');
    const stylesManager = require('./styles-manager');

    const matchedBookmarks = require('./bookmarks/matched');
    const recentBookmarks = require('./bookmarks/recent');
    const bookmarksCollection = require('./bookmarks/collection');

    const settings = require('./settings');

    const results = $('#results');
    const input = $('#input');
    const customStyles = $('#styles');

    const settingsContainer = $('#settings');
    const settingsButton = $('#settingsButton');
    const tabs = $('#settingsTabs').find('.tab');
    const tabsContents = $('#settingsScreens').find('.tabContent');

    const upKey = 38;
    const downKey = 40;
    const enterKey = 13;
    const escKey = 27;
    const deleteKey = 46;

    const state = new Map();
    const templates = new Map();

    const settingsProvider = function() {
        return settings;
    };

    const setBookmarks = function(bookmarks) {
        state.set('bookmarks', bookmarks);
    };

    const clearResults = function() {
        results.empty();
        input.val('');
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
        dialogs.confirmation('Are you sure? You will not be able to recover this bookmark!', function(result) {
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

    const loadTemplates = function() {
        return $.get('templates/bookmarks.html').then(function(bookmarksTemplate) {
            templates.set('bookmarksTemplate', bookmarksTemplate);
        });
    };

    const loadBookmarks = function() {
        return bookmarksCollection.load();
    };

    const loadSettings = function() {
        return new Promise(function(resolve, _reject) {
            settings.onLoad(resolve);
        });
    };

    const renderStyles = function(styles) {
        customStyles.html(styles);
    };

    const render = function(bookmarks) {
        results.html(renderBookmarks({ bookmarks: bookmarks }));
    };

    const renderRecent = function() {
        const bookmarks = state.get('bookmarks');
        const recent = recentBookmarks.filter(bookmarks, settingsProvider);
        render(recent, recentBookmarks.wrap);
    };

    const renderMatched = function() {
        const bookmarks = state.get('bookmarks');
        const value = state.get('value');
        const matched = matchedBookmarks.filter(bookmarks, value, settingsProvider);
        render(matched, matchedBookmarks.wrap);
    };

    input.on('input', function(e) {
        state.set('value', e.target.value);
        renderMatched();
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
    tabSwitcher.init(tabs, tabsContents);
    tabSwitcher.onTab(function(data) {
        if (data.tab === 'themes') {
            settingsContainer.addClass('expanded');
            stylesManager.refresh();
        } else {
            settingsContainer.removeClass('expanded');
        }
    });

    settings.init(settingsContainer);

    stylesManager.init(settingsProvider);

    stylesManager.onStylesChange(renderStyles);

    messageService.listen({
        focus: input.focus.bind(input)
    });

    keyHandlers.setShortcut({ key: upKey,     alt: false, ctrl: false, shift: false }, selectPrev);
    keyHandlers.setShortcut({ key: downKey,   alt: false, ctrl: false, shift: false }, selectNext);
    keyHandlers.setShortcut({ key: enterKey,  alt: false, ctrl: false, shift: false }, openSelected);
    keyHandlers.setShortcut({ key: escKey,    alt: false, ctrl: false, shift: false }, dismiss);
    keyHandlers.setShortcut({ key: deleteKey, alt: false, ctrl: false, shift: true  }, removeBookmark);

    Promise.all([
        loadBookmarks(),
        loadTemplates(),
        loadSettings()
    ]).then(function(results) {
        const bookmarks = bookmarksCollection.transform(results[0], settingsProvider);
        setBookmarks(bookmarks);
        renderRecent();
    });

    input.focus();
});
