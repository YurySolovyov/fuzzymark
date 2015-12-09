'use strict';

require('vex-js/css/vex.css');
require('vex-js/css/vex-theme-plain.css');

const vex  = require('vex-js/js/vex.js');
vex.dialog = require('vex-js/js/vex.dialog.js');
vex.defaultOptions.className = 'vex-theme-plain';

module.exports = {
    confirmation: function(message, callback) {
        return vex.dialog.confirm({
            message: message,
            callback: callback
        });
    }
};
