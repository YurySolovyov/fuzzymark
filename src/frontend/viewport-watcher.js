const baseOffset = 25;

const isWithinContainer = (container, element) => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.top >= containerRect.top + baseOffset &&
    elementRect.bottom <= containerRect.bottom - baseOffset
  );
};

const ensureInViewport = (container, element) => {
  if (!isWithinContainer(container, element)) {
    element.scrollIntoView({ block: 'nearest' });
  }
};

export default ensureInViewport;
