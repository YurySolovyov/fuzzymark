'use strict';
const indexUrl = chrome.extension.getURL('static/index.html');

const createOrSelectTab = require('./tab-opener.js');
const processStoreMessages = require('./store-message-processor.js');
const handleOnInstalled = require('./install-handler.js');

const openOptions = createOrSelectTab.bind(null, indexUrl);

chrome.commands.onCommand.addListener(openOptions);

chrome.browserAction.onClicked.addListener(openOptions);

chrome.runtime.onMessage.addListener(processStoreMessages);

chrome.runtime.onInstalled.addListener(handleOnInstalled);
