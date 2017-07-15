'use strict';
const messageService = require('./message-service');

const fetchAll = function() {
  return messageService.send({ type: 'settings' });
};

const fetchSetting = function(key) {
  return messageService.send({ type: 'get_setting', key });
};

const saveSetting = function(key, value) {
  return messageService.send({ type: 'set_setting', key, value });
};

module.exports = {
  fetchAll,
  fetchSetting,
  saveSetting,
};
