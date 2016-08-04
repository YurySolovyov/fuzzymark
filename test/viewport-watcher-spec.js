const ViewportWatcher = require('./../src/frontend/viewport-watcher.js');

describe('ViewportWatcher', function() {

    const createContainer = function(top, height) {
        return {
            scrollTop: () => { return top; },
            height: () => { return height; },
        };
    };

    const createElement = function(top, height) {
        return {
            height: () => { return height; },
            position: () => { return { top: top }; }
        };
    };

    it('scrolls down', function() {
        const element = createElement(700, 100);
        const container = createContainer(0, 500);
        const scrolled = ViewportWatcher.getScrollTop(container, element);
        expect(scrolled).toBeGreaterThan(0);
    });

    it('scrolls up', function() {
        const element = createElement(300, 100);
        const container = createContainer(300, 500);
        const scrolled = ViewportWatcher.getScrollTop(container, element);
        expect(scrolled).toBeLessThan(300);
    });

});
