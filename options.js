$(function() {
    'use strict';

    const results = $('.results').hide();

    $(':input').each(function(index, element) {
        const inputName = this.name;

        chrome.runtime.sendMessage({
            type: 'get_setting',
            key: inputName
        }, function(response) {
            element.value = response[inputName];
        });
    });

    $('.inputs').on('change', ':input', function() {
        results.hide();

        chrome.runtime.sendMessage({
            type: 'set_setting',
            key: this.name,
            value: this.value
        }, function(response) {
            if (response.status) {
                results.stop().fadeIn('slow').fadeOut('slow');
            }
        });
    });
});
