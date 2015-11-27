'use strict';
const dateFormat = require('dateformat');

const settings = require('./../settings.js');

const propertyKey = settings.get('propertyKey');
const maxResults = settings.get('maxResults');

const wrap = function(item, index) {
    return {
        id: item.id,
        selected: index === 0,
        score: dateFormat(new Date(item.dateAdded), 'shortDate'),
        title: item.title,
        wrappedUrl: item.url,
        url: item.url,
        favicon: item.favicon
    };
};

module.exports = {
    filter: function(bookmarks) {
        return bookmarks.sort(function(bookmark1, bookmark2) {
            return bookmark2.dateAdded - bookmark1.dateAdded;
        }).slice(0, maxResults).map(wrap);
    }
};
