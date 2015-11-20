const RangesReducer = require('./ranges-reducer.js');
const FuzzaldrinPlus = require('fuzzaldrin-plus');

function MatchHighlighter() {
    'use strict';

    const reducer = new RangesReducer();

    const wrapHighlight = function(letter) {
        return '<b>' + letter + '</b>';
    };

    this.highlight = function(input, result) {
        const matched = FuzzaldrinPlus.match(result, input);
        const matchPattern = reducer.reduce(matched).map(function(range) {
            return range.map(function(index) {
                return result.charAt(index);
            }).join('').replace(/\W/g, '\\$&');
        }).join('|');

        const matcher = new RegExp(matchPattern, 'gi');
        return result.replace(matcher, wrapHighlight);
    };

    return this;
}

module.exports = MatchHighlighter;
