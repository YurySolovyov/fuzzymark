import SettingsStore from './settings-store';
import createOrSelectTab from './tab-opener';

const settingsStore = new SettingsStore;

const fetchSettings = (request, sender, sendResponse) => {
  settingsStore.all().then(value => {
    sendResponse(value);
  });
};

const setSetting = (request, sender, sendResponse) => {
  settingsStore.set(request.key, request.value).then(_value => {
    sendResponse({ status: true });
  });
};

const getSetting = (request, sender, sendResponse) => {
  settingsStore.get(request.key).then(value => {
    sendResponse(value);
  });
};

const removeSetting = (request, sender, sendResponse) => {
  settingsStore.remove(request.key).then(() => {
    sendResponse({ status: true });
  });
};

const openTab = (request, sender, sendResponse) => {
  return createOrSelectTab(request.url, sendResponse);
};

const handlers = new Map([
  ['fetch-settings', fetchSettings],
  ['set-setting',    setSetting],
  ['get-setting',    getSetting],
  ['remove-setting', removeSetting],
  ['open-tab',       openTab],
]);

const entrypoint = (request, sender, sendResponse) => {
  const handler = handlers.get(request.type);

  if (handler) {
    handler(request.message, sender, sendResponse);
  }
  
  return true;
};

export default entrypoint;
