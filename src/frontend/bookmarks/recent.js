'use strict';
const dateFormat = require('dateformat');

const settings = require('./../settings.js');

const propertyKey = settings.get('propertyKey');
const maxResults = settings.get('maxResults');

const formatDate = function(item) {
    return dateFormat(new Date(item.dateAdded), 'dd mmm yy');
};

const wrap = function(item, index) {
    return Object.assign(item, {
        selected: index === 0,
        score: formatDate(item),
        wrappedTitle: item.title,
        wrappedUrl: item.url
    });
};

module.exports = {
    filter: function(bookmarks) {
        return bookmarks.sort(function(bookmark1, bookmark2) {
            return bookmark2.dateAdded - bookmark1.dateAdded;
        }).slice(0, maxResults).map(wrap);
    }
};
