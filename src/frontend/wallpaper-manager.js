'use strict';

// local one does not perform sync
const storage = chrome.storage.local;

const save = function(value) {
  return new Promise(function(resolve, _reject) {
    storage.set({ 'wallpaper': value }, resolve);
  });
};

const get = function() {
  return new Promise(function(resolve, _reject) {
    storage.get('wallpaper', res => resolve(res.wallpaper));
  });
};

const clear = function() {
  return new Promise(function(resolve, _reject) {
    storage.remove('wallpaper', resolve);
  });
};

module.exports = {
  save,
  get,
  clear
};
