'use strict';

const createOrSelectTab = require('./tab-opener.js');
const processStoreMessages = require('./store-message-processor.js');
const handleOnInstalled = require('./install-handler.js');

const indexUrl = chrome.runtime.getURL('static/index.html');
const openOptions = createOrSelectTab.bind(null, indexUrl);

chrome.browserAction.onClicked.addListener(openOptions);
chrome.runtime.onMessage.addListener(processStoreMessages);
chrome.runtime.onInstalled.addListener(handleOnInstalled);

handleOnInstalled();
