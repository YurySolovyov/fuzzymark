function MatchHighlighter() {
    'use strict';

    this.highlight = function(input, result) {
        let letters = input.toLowerCase().split('');
        let wrappedResult = result.split('');

        for (let i = 0; i < wrappedResult.length; ++i) {
            if (wrappedResult[i].toLowerCase() === letters[0]) {
                wrappedResult[i] = wrapLetter(wrappedResult[i]);
                letters.shift();
            }
        }

        return wrappedResult.join('');
    };

    const wrapLetter = function(letter) {
        return "<b>" + letter + "</b>";
    }

    return this;
};
