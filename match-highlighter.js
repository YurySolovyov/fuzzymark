function MatchHighlighter() {
    'use strict';

    const wrapHighlight = function(letter) {
        return '<b>' + letter + '</b>';
    };

    this.highlight = function(input, result) {
        const matched = FuzzaldrinPlus.match(result, input);

        const letters = result.split('');

        matched.forEach(function(letterIndex) {
            letters[letterIndex] = wrapHighlight(letters[letterIndex]);
        });

        return letters.join('');
    };

    return this;
}
