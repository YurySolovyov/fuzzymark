'use strict';

const settings = require('./../settings.js');
const FuzzaldrinPlus = require('fuzzaldrin-plus');
const _ = require('lodash');

const propertyKey = settings.get('propertyKey');
const maxResults = settings.get('maxResults');

const highlight = _.partial(require('./../match-highlighter.js'), {
    match: FuzzaldrinPlus.match,
    reduce: require('./../ranges-reducer.js'),
    wrap: (string) => '<b>' + string + '</b>'
});

const wrap = function(value, item, index) {
    const title = item[propertyKey];
    const score = FuzzaldrinPlus.score(title, value);
    const wrappedTitle = highlight(value, title);
    return {
        id: item.id,
        selected: index === 0,
        score: score,
        title: wrappedTitle,
        url: item.url,
        favicon: item.favicon
    };
};

module.exports = {
    filter: function(bookmarks, value) {
        return FuzzaldrinPlus.filter(bookmarks, value, {
            key: propertyKey,
            maxResults: maxResults
        }).map(wrap.bind(null, value));
    }
};
