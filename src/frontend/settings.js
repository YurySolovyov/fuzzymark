'use strict';

const store = new Map();

const $ = require('jquery');
const messageService = require('./message-service');

const autoInitializeSettings = [
  'maxResults',
  'propertyKey',
  'activeTheme',
  'themesList'
];

const changeHandlers = $.Callbacks();
const loadHandlers = $.Callbacks();

const fetchAll = function() {
  return messageService.send({
    type: 'settings'
  });
};

const fetchSetting = function(key) {
  return messageService.send({
    type: 'get_setting',
    key: key
  });
};

const saveSetting = function(key, value) {
  store.set(key, value);
  return messageService.send({
    type: 'set_setting',
    key: key,
    value: value
  });
};

const removeSetting = function(key) {
  return messageService.send({
    type: 'remove_setting',
    key: key
  });
};

const initSetting = function(response, container, key) {
  const input = container.find(`[data-name='${key}']`);
  const value = response[key];
  input.val(value);
  triggerChange(key, value);
};

const triggerChange = function(key, value) {
  const indicator = $('#saveIndicator').hide();

  return saveSetting(key, value).then(function(response) {
    indicator.stop(true).fadeIn().fadeOut();
    changeHandlers.fire(key, value);
    return response;
  });
};

const init = function(container) {

  container.on('change input', '[data-name]', function() {
    const input = $(this);
    const key = input.data('name');
    const value = input.val();
    triggerChange(key, value);
  });

  return fetchAll().then(function(response) {
    autoInitializeSettings.forEach(initSetting.bind(null, response, container));
    loadHandlers.fire(response);
  });
};

const onLoad = loadHandlers.add.bind(loadHandlers);
const onChange = changeHandlers.add.bind(changeHandlers);

module.exports = {
  fetchAll,
  init,
  saveSetting,
  removeSetting,
  fetchSetting,
  onChange,
  onLoad,
  triggerChange,
  store
};
