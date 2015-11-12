(function(self) {
    'use strict';
    const optionsUrl = chrome.extension.getURL('index.html');

    const openExtPage = function() {
        chrome.tabs.query({ url: optionsUrl }, function(tabs) {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, { active: true });
            } else {
                chrome.tabs.create({ url: optionsUrl });
            }
        });
    };

    chrome.commands.onCommand.addListener(function(command) {
       openExtPage();
    });

})(this);
