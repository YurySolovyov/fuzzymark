'use strict';

const settingsStore = new Map();

const $ = require('jquery');
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

const removeSetting = function(key) {
    return messageService.send({
        type: 'remove_setting',
        key: key
    });
};

const initSetting = function(element) {
    const input = $(element);
    const key = input.data('name');

    return fetchSetting(key).then(function(response) {
        const value = response[key];
        input.val(value);
        triggerChange(key, value);
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

    container.on('change input', '[data-name]', function() {
        const input = $(this);
        const key = input.data('name');
        const value = input.val();
        triggerChange(key, value);
    });

    const settingsRequests = $.map(container.find('[data-name]'), initSetting);
    return Promise.all(settingsRequests).then(function() {
        loadHandlers.fire();
    });
};

const onLoad = loadHandlers.add.bind(loadHandlers);

module.exports = {
    init: initalize,
    saveSetting: saveSetting,
    removeSetting: removeSetting,
    fetchSetting: fetchSetting,
    onChange: changeHandlers.add.bind(changeHandlers),
    onLoad: onLoad,
    triggerChange: triggerChange,
    store: settingsStore
};
