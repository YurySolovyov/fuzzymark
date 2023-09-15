import FuzzaldrinPlus from 'fuzzaldrin-plus';
import highlighter from '../match-highlighter';
import reducer from '../ranges-reducer';

const highlight = highlighter.bind(null, {
  match: FuzzaldrinPlus.match,
  reduce: reducer,
  wrap: (string) => '<b>' + string + '</b>'
});

const wrap = function(key, value, selectedIndex, item, index) {
  const property = item[key].toLowerCase();

  const wrappedTitle = highlight(value, item.title);
  const wrappedUrl = highlight(value, item.url);

  const score = FuzzaldrinPlus.score(property, value.toLowerCase());

  return Object.assign({}, item, {
    selected: index === selectedIndex,
    score: score,
    wrappedTitle: wrappedTitle,
    wrappedUrl: wrappedUrl
  });
};

const filter = function(bookmarks, value, settings) {
  const { propertyKey, maxResults, selectedIndex } = settings;

  return FuzzaldrinPlus.filter(bookmarks, value, {
    key: propertyKey,
    maxResults: maxResults
  }).map(wrap.bind(null, propertyKey, value, selectedIndex));
};

export default {
  filter
};
