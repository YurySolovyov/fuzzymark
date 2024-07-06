const defaults = [{
  key: 'maxResults',
  value: 10
}, {
  key: 'propertyKey',
  value: 'title'
}, {
  key: 'activeTheme',
  value: 'light'
}, {
  key: 'accent',
  value: 'blue'
}, {
  key: 'openNew',
  value: true
}, {
  key: 'initialComponent',
  value: 'my'
}, {
  key: 'initialFocus',
  value: 'bookmarks'
}, {
  key: 'tiles',
  value: []
}, {
  key: 'showChromeUrls',
  value: false
}];

const installIfNeeded = (settings, item) => {
  return settings.get(item.key).then(value => {
    if (value[item.key] !== undefined) {
      return;
    }

    return settings.set(item.key, item.value);
  });
};

const install = function(settings) {
  const requests = defaults.map(item => installIfNeeded(settings, item));
  return Promise.all(requests);
};

export default {
  install
};
