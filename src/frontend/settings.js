'use strict';

const settingsStore = new Map([
    ['maxResults', 20],
    ['propertyKey', 'title']
]);

const $ = require('jquery');
const settings = require('./settings');
const messageService = require('./message-service');

const changeHandlers = $.Callbacks();
const loadHandlers = $.Callbacks();

const saveSetting = function(key, value) {
    settingsStore.set(key, value);
    return messageService.send({
        type: 'set_setting',
        key: key,
        value: value
    });
};

const fetchSetting = function(key) {
    return messageService.send({
        type: 'get_setting',
        key: key
    });
};

const initSetting = function(index, element) {
    const input = $(element);
    const key = input.data('name');

    fetchSetting(key).then(function(response) {
        const value = response[key];
        input.val(value);
        triggerChange(key, value);
        loadHandlers.fire(key, value);
    });
};

const triggerChange = function(key, value) {
    const indicator = $('#saveIndicator').hide();

    return saveSetting(key, value).then(function(response) {
        indicator.stop(true).fadeIn().fadeOut();
        changeHandlers.fire(key, value);
        return response;
    });
};

const initalize = function(container) {

    container.on('change input', ':input', function() {
        const input = $(this);
        const key = input.data('name');
        const value = input.val();
        triggerChange(key, value);
    });

    container.find('[data-name]').each(initSetting);
};

module.exports = {
    init: initalize,
    saveSetting: saveSetting,
    onChange: changeHandlers.add.bind(changeHandlers),
    onLoad: loadHandlers.add.bind(loadHandlers),
    triggerChange: triggerChange,
    store: settingsStore
};
