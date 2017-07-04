'use strict';

require('vex-js/dist/css/vex.css');
require('vex-js/dist/css/vex-theme-plain.css');

const vex  = require('vex-js/dist/js/vex.js');
vex.dialog = require('vex-dialog/src/vex.dialog.js');
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
