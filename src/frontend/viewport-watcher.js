'use strict';

const withinviewport = require('withinviewport');
withinviewport.defaults.sides = 'top bottom';

const baseOffset = 25;
const viewportOptions = {
  top: baseOffset,
  bottom: baseOffset
};

const startAtBottom = function(container, element) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return containerRect.height / 2 > elementRect.top;
};

const ensureInViewport = function(container, element) {
  const visible = withinviewport(element, viewportOptions);
  if (!visible) {
    element.scrollIntoView(startAtBottom(container, element));
  }
};

module.exports = {
  ensureInViewport
};
