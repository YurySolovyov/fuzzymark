const normalizeSize = (size) => {
  const numericSize = Number(size);

  if (!Number.isFinite(numericSize)) {
    return 0;
  }

  return Math.max(0, Math.trunc(numericSize));
};

const chunk = (items, size = 1) => {
  const chunkSize = normalizeSize(size);

  if (items.length === 0 || chunkSize === 0) {
    return [];
  }

  const chunks = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
};

export default chunk;
