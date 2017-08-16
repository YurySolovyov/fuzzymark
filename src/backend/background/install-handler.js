'use strict';

const defaultsInstaller = require('./defaults-installer.js');
const SettingsStore = require('./settings-store.js');

const Settings = new SettingsStore();

module.exports = function() {
  Settings.get('already_installed').then(function(value) {
    defaultsInstaller.install(Settings);
  });
};
