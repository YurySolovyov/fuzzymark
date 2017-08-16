'use strict';

const defaultsInstaller = require('./defaults-installer.js');
const SettingsStore = require('./settings-store.js');

const Settings = new SettingsStore();

module.exports = defaultsInstaller.install.bind(null, Settings);
