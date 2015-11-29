'use strict';

const SettingsStore = require('./settings-store.js');
const createOrSelectTab = require('./tab-opener.js');

const settingsStore = new SettingsStore;

const settings = function(request, sender, sendResponse) {
    settingsStore.all().then(function(value) {
        sendResponse(value);
    });
};

const setSetting = function(request, sender, sendResponse) {
    settingsStore.set(request.key, request.value).then(function(_value) {
        sendResponse({ status: true });
    });
};

const getSetting = function(request, sender, sendResponse) {
    settingsStore.get(request.key).then(function(value) {
        sendResponse(value);
    });
};

const openTab = function(request, sender, sendResponse) {
    return createOrSelectTab(request.url, sendResponse);
};

const handlers = {
    settings: settings,
    set_setting: setSetting,
    get_setting: getSetting,
    open_tab: openTab
};

module.exports = function(request, sender, sendResponse) {
    const handler = handlers[request.type];

    if (handler) {
        handler(request, sender, sendResponse);
    }
    return true;
};
