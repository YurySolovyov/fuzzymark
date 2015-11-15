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
