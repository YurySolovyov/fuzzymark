'use strict';
const messageService = require('./message-service');

const fetchAll = function() {
  return messageService.send('fetch-settings');
};

const fetchSetting = function(key) {
  return messageService.send('get-setting', { key });
};

const saveSetting = function(key, value) {
  return messageService.send('set-setting', { key, value });
};

module.exports = {
  fetchAll,
  fetchSetting,
  saveSetting,
};
