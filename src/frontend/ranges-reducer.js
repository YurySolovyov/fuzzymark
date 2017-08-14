'use strict';

module.exports = function reduce(indexes) {
  return indexes.reduce(function(ranges, index, pos) {
    const prevIndex = indexes[pos - 1];
    const currentIndex = indexes[pos];
    const nextIndex = indexes[pos + 1];

    const rangeBehind = currentIndex === prevIndex + 1;
    const rangeAhead = currentIndex === nextIndex - 1 && rangeBehind;

    const currentSlot = ranges.length - 1;

    let slot;
    if (rangeAhead || rangeBehind) {
      slot = ranges[currentSlot];
    } else {
      slot = [];
      ranges.push(slot);
    }

    slot.push(currentIndex);

    return ranges;
  }, []);
};
