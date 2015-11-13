(function(self) {
    'use strict';
    const optionsUrl = chrome.extension.getURL('index.html');

    const createOrSelectTab = function(url) {
        chrome.tabs.query({ url: url }, function(tabs) {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, { active: true });
            } else {
                chrome.tabs.create({ url: url });
            }
        });
    };

    chrome.commands.onCommand.addListener(function(command) {
       createOrSelectTab(optionsUrl);
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
       createOrSelectTab(optionsUrl);
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.type === 'open_tab') {
            createOrSelectTab(request.url);
        }
    });

})(this);
