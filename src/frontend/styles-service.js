'use strict';

const settings = require('./settings');
const styleMap = new Map();

const saveActiveTheme = settings.saveSetting.bind(settings, 'activeTheme');
const saveThemesList = settings.saveSetting.bind(settings, 'themesList');

const getThemeKey = function(name) {
  return JSON.stringify({ theme: name });
};

const getStyles = styleMap.get.bind(styleMap);

const renderThemes = function(list, response) {
  list.forEach(function(name) {
    const themeKey = getThemeKey(name);
    const theme = response[themeKey];
    styleMap.set(theme.name, theme.styles);
  });
};

const saveTheme = function(name, styles) {
  styleMap.set(name, styles);
  const themeKey = getThemeKey(name);
  return settings.triggerChange(themeKey, {
    name: name,
    styles: styles
  });
};

const addTheme = function(name, styles, list) {
  return Promise.all([
    saveTheme(name, styles),
    saveThemesList(list)
  ]);
};

const removeTheme = function(name, list) {
  styleMap.delete(name);

  const themeKey = getThemeKey(name);

  return Promise.all([
    saveThemesList(list),
    settings.removeSetting(themeKey)
  ]);
};

module.exports = {
  getThemeKey,
  getStyles,
  saveActiveTheme,
  saveThemesList,
  renderThemes,
  addTheme,
  saveTheme,
  removeTheme
};
