import { withinViewport } from 'withinviewport';

const baseOffset = 25;
const viewportOptions = {
  top: baseOffset,
  bottom: baseOffset,
  left: 'ignore',
  right: 'ignore',
};

const startAtBottom = function(container, element) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return containerRect.height / 2 > elementRect.top;
};

const ensureInViewport = function(container, element) {
  const visible = withinViewport(element, viewportOptions);
  if (!visible) {
    element.scrollIntoView(startAtBottom(container, element));
  }
};

export default ensureInViewport;
