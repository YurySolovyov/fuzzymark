'use strict';

const dateFormat = require('dateformat');

const formatDate = function(item) {
  return dateFormat(new Date(item.dateAdded), 'dd mmm yy');
};

const wrap = function(selectedIndex, item, index) {
  return Object.assign({}, item, {
    selected: index === selectedIndex,
    score: formatDate(item),
    wrappedTitle: item.title,
    wrappedUrl: item.url
  });
};

const filter = function(bookmarks, settings) {
  const { maxResults, selectedIndex } = settings;
  return bookmarks.sort(function(bookmark1, bookmark2) {
    return bookmark2.dateAdded - bookmark1.dateAdded;
  }).slice(0, maxResults).map(wrap.bind(null, selectedIndex));
};

module.exports = {
  filter
};
