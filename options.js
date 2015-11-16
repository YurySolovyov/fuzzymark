$(function() {
    'use strict';

    const results = $('.results').hide();

    $(':input').each(function(index, element) {
        const inputName = this.name;

        chrome.extension.sendMessage({
            type: 'get_setting',
            key: inputName
        }, function(response) {
            element.value = response[inputName];
        });
    });

    $('.inputs').on('change', ':input', function() {
        const result = true;

        results.hide();

        chrome.extension.sendMessage({
            type: 'set_setting',
            key: this.name,
            value: this.value
        }, function(response) {
            result = response.status;
        });

        if (result) {
            results.stop().fadeIn('slow').fadeOut('slow');
        }
    });
});

