import createOrSelectTab from './tab-opener';
import processStoreMessages from './store-message-processor';
import handleOnInstalled from './install-handler';
import storageListener from './storage-listener';

const indexUrl = chrome.runtime.getURL('index.html');
const openOptions = createOrSelectTab.bind(null, indexUrl);

chrome.action.onClicked.addListener(openOptions);
chrome.runtime.onMessage.addListener(processStoreMessages);
chrome.runtime.onInstalled.addListener(handleOnInstalled);
chrome.storage.onChanged.addListener(storageListener);

handleOnInstalled();
