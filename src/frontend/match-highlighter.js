function MatchHighlighter() {
    'use strict';

    const mergeRanges = function(indexes) {
        return indexes.reduce(function(obj, index, pos) {
            const prevIndex = indexes[pos - 1] || 0;
            const currentIndex = indexes[pos];
            const nextIndex = indexes[pos + 1] || 0;

            if (currentIndex === nextIndex - 1 || currentIndex === prevIndex + 1 || indexes.length === 1) {
                obj.ranges[obj.rangeIndex].push(currentIndex);
            } else if (currentIndex > 0 && indexes.length > 1) {
                obj.rangeIndex = obj.ranges.push([currentIndex]) - 1;
            }
            return obj;
        }, {
            ranges:[[]],
            rangeIndex: 0
        }).ranges;
    };

    const wrapHighlight = function(letter) {
        return '<b>' + letter + '</b>';
    };

    this.highlight = function(input, result) {
        const matched = FuzzaldrinPlus.match(result, input);
        const substrings = mergeRanges(matched).map(function(range) {
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
