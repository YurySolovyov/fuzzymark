module.exports = function listen(handlers) {
    chrome.runtime.onMessage.addListener(function(request, _sender, _sendResponse) {
        const handler = handlers[request.type];
        if (handler) {
            handler();
        }
        return true;
    });
};
