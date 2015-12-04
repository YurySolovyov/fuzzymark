'use strict';

const connect = function(button, layer) {
    button.on('click', function() {
        if (button.hasClass('active')) {
            button.removeClass('active');
            layer.removeClass('active');
        } else {
            button.addClass('active');
            layer.addClass('active');
        }
    });
};

module.exports = {
    connect: connect
};
