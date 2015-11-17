describe('RangesReducer', function() {
    'use strict';

    const subject = new RangesReducer();

    it('leaves non-ranged indexes as is', function() {
        const reduced = subject.reduce([2, 4, 9]);
        expect(reduced).toEqual([[2], [4], [9]]);
    });

    it('leaves single-index range as is', function() {
        const reduced = subject.reduce([2]);
        expect(reduced).toEqual([[2]]);
    });

    it('leaves continious range as is', function() {
        const reduced = subject.reduce([0, 1, 2, 3, 4, 5]);
        expect(reduced).toEqual([[0, 1, 2, 3, 4, 5]]);
    });

    it('reduces range at the beginning', function() {
        const reduced = subject.reduce([0, 1, 2, 3, 7]);
        expect(reduced).toEqual([[0, 1, 2, 3], [7]]);
    });

    it('reduces range at the end', function() {
        const reduced = subject.reduce([0, 7, 8, 9, 10]);
        expect(reduced).toEqual([[0], [7, 8, 9, 10]]);
    });

    it('reduces range in center', function() {
        const reduced = subject.reduce([0, 7, 8, 9, 11]);
        expect(reduced).toEqual([[0], [7, 8, 9], [11]]);
    });

    it('reduces ranges on the ends', function() {
        const reduced = subject.reduce([0, 1, 2, 3, 8, 10, 11, 12, 13]);
        expect(reduced).toEqual([[0, 1, 2, 3], [8], [10, 11, 12, 13]]);
    });
});
