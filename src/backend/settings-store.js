const storage = chrome.storage.sync;

class SettingsStore {
  get(key) {
    return new Promise(function(resolve, _reject) {
      storage.get(key, resolve);
    });
  }

  set(key, value) {
    return new Promise(function(resolve, _reject) {
      storage.set({ [key]: value }, resolve);
    });
  }

  remove(key) {
    return new Promise(function(resolve, _reject) {
      storage.remove(key, resolve);
    });
  }

  all() {
    return new Promise(function(resolve, _reject) {
      storage.get(null, resolve);
    });
  }
}

export default SettingsStore;
