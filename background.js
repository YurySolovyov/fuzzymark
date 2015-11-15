(function(self) {
    'use strict';
    const optionsUrl = chrome.extension.getURL('index.html');
    const settingsStore = new SettingsStore;

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
        if (request.type === 'settings') {
            settingsStore.all().then(function(value) {
                sendResponse(value);
            })
        };

        if (request.type === 'set_setting') {
            settingsStore.set(request.key, request.value).then(function(value) {
                sendResponse({status: true})
            });
        };

        if (request.type === 'get_setting') {
            settingsStore.get(request.key).then(function(value) {
                sendResponse(value);
            });
        };

        if (request.type === 'open_tab') {
            createOrSelectTab(request.url);
        }

        return true;
    });

})(this);


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
