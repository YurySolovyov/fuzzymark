'use strict';

const gettingStartedUrl = chrome.extension.getURL('static/getting-started.html');
const createOrSelectTab = require('./tab-opener.js');
const defaultsInstaller = require('./defaults-installer.js');
const SettingsStore = require('./settings-store.js');
const Settings = new SettingsStore();

module.exports = function() {
  Settings.get('already_installed').then(function(value) {
    if (value && !value.already_installed) {
      createOrSelectTab(gettingStartedUrl);
      Settings.set('already_installed', true);
    }
    defaultsInstaller.install(Settings);
  });
};
