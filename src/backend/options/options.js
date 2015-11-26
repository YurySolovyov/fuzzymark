const $ = require('jquery');

$(function() {
    'use strict';

    const results = $('.results').hide();

    const sendMessage = function(message) {
        return new Promise(function(resolve, _reject) {
            chrome.runtime.sendMessage(message, resolve);
        });
    };

    $(':input').each(function(index, element) {
        const inputName = this.name;

        sendMessage({
            type: 'get_setting',
            key: inputName
        }).then(function(response) {
            element.value = response[inputName];
        });
    });

    $('.inputs').on('change input', ':input', function() {
        results.hide();

        sendMessage({
            type: 'set_setting',
            key: this.name,
            value: this.value
        }).then(function(response) {
            if (response.status) {
                results.stop(true).fadeIn('slow').fadeOut('slow');
            }
        });
    });
});
