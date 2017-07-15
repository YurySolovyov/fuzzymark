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
  key: 'openNew',
  value: true
}];

const installIfNeeded = function(settings, item) {
  return settings.get(item.key).then(function(value) {
    if (value[item.key]) { return; }
    return settings.set(item.key, item.value);
  });
};

const install = function(settings) {
  const requests = defaults.map(installIfNeeded.bind(null, settings));
  return Promise.all(requests);
};

module.exports = {
  install
};
