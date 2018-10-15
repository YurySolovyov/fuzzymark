'use strict';

const isFirefox = typeof chrome !== 'undefined' && typeof browser !== 'undefined';

module.exports = (url) => {
  return isFirefox ? new URL(url).origin + '/favicon.ico' : 'chrome://favicon/' + url;
};