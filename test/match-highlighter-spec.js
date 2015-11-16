describe('MatchHighlighter', function() {
    'use strict';

    const subject = new MatchHighlighter;

    it('highlights with one tag full equal string', function() {
        const result = subject.highlight('abc', 'abc');
        expect(result).toEqual('<b>abc</b>');
    });

    it('highlights with one tag consecutive letters', function() {
        const result = subject.highlight('bc', 'abcd');
        expect(result).toEqual('a<b>bc</b>d');
    });

    it('highlights last letters if it match', function() {
        const result = subject.highlight('cd', 'abcd');
        expect(result).toEqual('ab<b>cd</b>');
    });

    it('highlights first letters if it match', function() {
        const result = subject.highlight('ab', 'abcd');
        expect(result).toEqual('<b>ab</b>cd');
    });

    it('highlights one letter if it match', function() {
        const result = subject.highlight('b', 'abcd');
        expect(result).toEqual('a<b>b</b>cd');
    });

    it('highlights one letter if it match at begin of string', function() {
        const result = subject.highlight('a', 'abcd');
        expect(result).toEqual('<b>a</b>bcd');
    });

    it('highlights one letter if it match at end of string', function() {
        const result = subject.highlight('d', 'abcd');
        expect(result).toEqual('abc<b>d</b>');
    });
});
