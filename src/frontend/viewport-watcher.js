'use strict';

const withinviewport = require('withinviewport');
withinviewport.defaults.sides = 'top bottom';

const baseOffset = 25;
const viewportOptions = {
    // this is workround of bug where withinviewport can't notice
    // that element is not within container top side
    top: baseOffset * 5,
    bottom: baseOffset
};

const getScrollTop = function(container, element) {
    const topOffset = element.position().top;
    const elementHeight = element.height();
    const containerHeight = container.height();
    const scrollTop = container.scrollTop();

    if (topOffset >= scrollTop + containerHeight - baseOffset - elementHeight) {
        return topOffset - containerHeight + baseOffset + elementHeight;
    } else {
        return topOffset - baseOffset - elementHeight;
    }
};

module.exports = {
    ensureInViewport: function(container, element) {
        const visible = withinviewport(element.get(0), viewportOptions);
        if (!visible) {
            container.stop(true, true).animate({
                scrollTop: getScrollTop(container, element)
            }, 200);
        }
    },
    getScrollTop: getScrollTop
};
