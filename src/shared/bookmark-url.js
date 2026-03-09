const trimValue = (value) => (typeof value === 'string' ? value.trim() : '');

export const parseStoredUrl = (value) => {
  const rawValue = trimValue(value);

  if (rawValue === '') {
    return [false, ''];
  }

  const parsed = URL.parse(rawValue);

  return parsed ? [true, parsed.toString()] : [false, ''];
};

export const parseInputUrl = (value) => {
  const [valid, url] = parseStoredUrl(value);

  if (valid) {
    return [true, url];
  }

  const rawValue = trimValue(value);

  if (rawValue === '') {
    return [false, ''];
  }

  const parsed = URL.parse(`http://${rawValue}`);

  return parsed ? [true, parsed.toString()] : [false, ''];
};

export const getDisplayBookmarkUrl = (value) => {
  const [valid, url] = parseStoredUrl(value);

  if (!valid) {
    return typeof value === 'string' ? value : '';
  }

  const parsed = URL.parse(url);

  if (!parsed) {
    return url;
  }

  if (parsed.host !== '') {
    return parsed.host + (parsed.pathname.length > 1 ? parsed.pathname : '');
  }

  return parsed.toString();
};
