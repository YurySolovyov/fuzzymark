'use strict';

const createOrSelectTab = require('./tab-opener.js');
const defaultsInstaller = require('./defaults-installer.js');
const SettingsStore = require('./settings-store.js');

const Settings = new SettingsStore();
const indexUrl = chrome.runtime.getURL('static/index.html');
const gettingStartedUrl = `${indexUrl}#/getting-started`;

module.exports = function() {
  Settings.get('already_installed').then(function(value) {
    if (value && !value.already_installed) {
      createOrSelectTab(gettingStartedUrl);
      Settings.set('already_installed', true);
    }
    defaultsInstaller.install(Settings);
  });
};
