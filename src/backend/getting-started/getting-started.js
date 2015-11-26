const $ = require('jquery');
const createOrSelectTab = require('../background/tab-opener.js');
const commandsLink = 'chrome://extensions/configureCommands';

$(function() {
    $('.hotkeysLink').on('click', function(e) {
        e.preventDefault();
        createOrSelectTab(commandsLink);
    });
});
