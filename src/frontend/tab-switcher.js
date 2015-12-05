'use strict';

const $ = require('jquery');

const onTabHandlers = $.Callbacks();

const initialize = function(tabs, containers) {
    tabs.on('click', function() {
        const element = $(this);
        if (element.hasClass('active')) { return; }
        const index = element.index();
        tabs.removeClass('active');
        tabs.eq(index).addClass('active');
        containers.removeClass('active').eq(index).addClass('active');
        onTabHandlers.fire(element.data());
    });

    tabs.first().trigger('click');
};

module.exports = {
    init: initialize,
    onTab: onTabHandlers.add.bind(onTabHandlers)
};
