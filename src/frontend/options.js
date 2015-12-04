'use strict';

const $ = require('jquery');
const settings = require('./settings');
const messageService = require('./message-service');

const handlers = [];

const handleChange = function(key, value) {
    handlers.forEach(function(handler) {
        handler(key, value);
    });
};

const saveSetting = function(key, value) {
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

const onChange = function(indicator) {
    return function() {
        const input = $(this);
        const value = input.val();
        const key = input.prop('name');
        indicator.hide();

        saveSetting(key, value).then(function(response) {
            if (response.status) {
                input.val(value);
                indicator.stop(true).fadeIn().fadeOut();
                handleChange(key, value);
            }
        });
    };
};

const initSetting = function(index, element) {
    const input = $(element);
    const key = input.prop('name');

    fetchSetting(key).then(function(response) {
        input.val(response[key]);
        handleChange(key, response[key]);
    });
};

const initalize = function(container) {
    const indicator = container.find('#saveIndicator').hide();

    container.on('change input', ':input', onChange(indicator));
    container.find(':input').each(initSetting);
};

module.exports = {
    init: initalize,
    onChange: handlers.push.bind(handlers)
};
