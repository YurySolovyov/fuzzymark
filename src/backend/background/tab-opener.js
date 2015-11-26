module.exports = function(url, callback) {
    chrome.tabs.query({ url: url }, function(tabs) {
        if (tabs.length) {
            chrome.tabs.update(tabs[0].id, { active: true });
            chrome.runtime.sendMessage({ type: 'focus' });
        } else {
            chrome.tabs.create({ url: url });
        }
        if (callback) {
            callback();
        }
    });
    return true;
};
