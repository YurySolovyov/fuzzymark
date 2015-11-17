function MatchHighlighter() {
    'use strict';

    const reducer = new RangesReducer();

    const wrapHighlight = function(letter) {
        return '<b>' + letter + '</b>';
    };

    this.highlight = function(input, result) {
        const matched = FuzzaldrinPlus.match(result, input);
        const substrings = reducer.reduce(matched).map(function(range) {
            return range.map(function(index) {
                return result.charAt(index);
            }).join('');
        });

        return substrings.reduce(function(res, substring) {
            return res.replace(substring, wrapHighlight(substring));
        }, result);
    };

    return this;
}
