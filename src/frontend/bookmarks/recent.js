import formatShortDate from '../date-formatter.js';

const wrap = (selectedIndex, item, index) => {
  return Object.assign({}, item, {
    selected: index === selectedIndex,
    score: formatShortDate(item.dateAdded),
    wrappedTitle: item.title,
    wrappedUrl: item.url,
  });
};

const filter = (bookmarks, settings) => {
  const { maxResults, selectedIndex } = settings;
  return bookmarks
    .sort((bookmark1, bookmark2) => {
      return bookmark2.dateAdded - bookmark1.dateAdded;
    })
    .slice(0, maxResults)
    .map(wrap.bind(null, selectedIndex));
};

export default {
  filter,
};
