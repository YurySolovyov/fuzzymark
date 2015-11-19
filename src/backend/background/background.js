(function(_self) {
    'use strict';
    const optionsUrl = chrome.extension.getURL('static/index.html');

    const createOrSelectTab = function(url, callback) {
        chrome.tabs.query({ url: url }, function(tabs) {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, { active: true });
            } else {
                chrome.tabs.create({ url: url });
            }
            callback();
        });
        return true;
    };

    chrome.commands.onCommand.addListener(function(_command) {
        createOrSelectTab(optionsUrl);
    });

    chrome.browserAction.onClicked.addListener(function(_tab) {
        createOrSelectTab(optionsUrl);
    });

    chrome.runtime.onMessage.addListener(function(request, _sender, sendResponse) {
        if (request.type === 'open_tab') {
            return createOrSelectTab(request.url, sendResponse);
        }
    });

    chrome.runtime.onMessage.addListener(new StoreMessageProcessor);
})(this);
