'use strict';

const createOrSelectTab = require('./tab-opener');
const processStoreMessages = require('./store-message-processor');
const handleOnInstalled = require('./install-handler');
const storageListener = require('./storage-listener');

const indexUrl = chrome.runtime.getURL('static/index.html');
const openOptions = createOrSelectTab.bind(null, indexUrl);

chrome.browserAction.onClicked.addListener(openOptions);
chrome.runtime.onMessage.addListener(processStoreMessages);
chrome.runtime.onInstalled.addListener(handleOnInstalled);
chrome.storage.onChanged.addListener(storageListener);

handleOnInstalled();
