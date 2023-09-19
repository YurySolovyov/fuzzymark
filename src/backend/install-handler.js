import defaultsInstaller from './defaults-installer.js';
import SettingsStore from './settings-store.js';

const Settings = new SettingsStore();

export default () => defaultsInstaller.install(Settings);
