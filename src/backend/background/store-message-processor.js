'use strict';

const SettingsStore = require('./settings-store');
const createOrSelectTab = require('./tab-opener');

const settingsStore = new SettingsStore;

const fetchSettings = function(request, sender, sendResponse) {
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

const removeSetting = function(request, sender, sendResponse) {
  settingsStore.remove(request.key).then(function() {
    sendResponse({ status: true });
  });
};

const openTab = function(request, sender, sendResponse) {
  return createOrSelectTab(request.url, sendResponse);
};

const handlers = new Map([
  ['fetch-settings', fetchSettings],
  ['set-setting',    setSetting],
  ['get-setting',    getSetting],
  ['remove-setting', removeSetting],
  ['open-tab',       openTab],
]);

module.exports = function(request, sender, sendResponse) {
  const handler = handlers.get(request.type);

  if (handler) {
    handler(request.message, sender, sendResponse);
  }
  return true;
};
