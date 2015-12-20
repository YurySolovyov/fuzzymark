'use strict';

require('vex-js/css/vex.css');
require('vex-js/css/vex-theme-plain.css');

const vex  = require('vex-js/js/vex.js');
vex.dialog = require('vex-js/js/vex.dialog.js');
vex.defaultOptions.className = 'vex-theme-plain';

const runDialog = function(type, message, callback) {
    return vex.dialog[type]({
        message: message,
        callback: callback
    });
};

const confirmation = runDialog.bind(null, 'confirm');
const notification = runDialog.bind(null, 'alert');

module.exports = {
    confirmation,
    notification
};
