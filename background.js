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

    chrome.runtime.onMessage.addListener(new StoreMessageProcessor);
})(this);

function StoreMessageProcessor() {
    'use strict'

    const settingsStore = new SettingsStore;

    const settings = function(request, sender, sendResponse) {
        settingsStore.all().then(function(value) {
            sendResponse(value);
        })
    }

    const setSetting = function(request, sender, sendResponse) {
        settingsStore.set(request.key, request.value).then(function(value) {
            sendResponse({status: true});
        });
    }

    const getSetting = function(request, sender, sendResponse) {
        settingsStore.get(request.key).then(function(value) {
            sendResponse(value);
        });
    }

    this.call = function(request, sender, sendResponse) {
        const processor = {
            'settings' : settings,
            'set_setting' : setSetting,
            'get_setting' : getSetting
        }[request.type];

        if (processor) {
            processor(request, sender, sendResponse);
        }
        return true;
    };

    return this.call;
}

function SettingsStore() {
    'use strict';

    const storage = chrome.storage.sync;

    this.get = function(key) {
        return new Promise(function(resolve, reject) {
            storage.get(key, resolve);
        });
    };

    this.set = function(key, value) {
        return new Promise(function(resolve, reject) {
            const values = {};
            values[key] = value;
            storage.set(values, resolve);
        });
    }

    this.all = function() {
        return new Promise(function(resolve, reject) {
            storage.get(null, resolve);
        })
    }

    return this;
};
