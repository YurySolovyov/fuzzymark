'use strict';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/css/css');

const $ = require('jquery');
const CodeMirror = require('codemirror');

const settings = require('./settings');
const stylesService = require('./styles-service');
const togglePair = require('./toggle-pair');
const dialogs = require('./dialogs');

const styleCss = $('#styleCss');
const tabContent = styleCss.closest('.tabContent');
const newThemeNameInput = $('#newThemeName');
const themeSelector = $('#themeSelector');
const addThemeButton = $('#themeAdd');

const styleChangeHandlers = $.Callbacks();

const enterKey = 13;

const handleStylesChange = function(newStyles) {
    styleChangeHandlers.fire(newStyles);
};

const editorOptions = {
    theme: 'material',
    lineNumbers: true,
    styleActiveLine: true,
    showCursorWhenSelecting: true,
    autofocus: true,
    mode: 'css'
};

const textarea = CodeMirror(styleCss.get(0), editorOptions);

const getThemeItem = function(name) {
    return $('<option />', { value: name }).html(name);
};

const themeNameIsNew = function(name) {
    return themeSelector.find('option').filter(`[value="${name}"]`).length === 0;
};

const getThemesList = function() {
    return $.map(themeSelector.find('option'), function(item) {
        return $(item).val();
    });
};

const renderStyles = function(styles) {
    textarea.setOption('value', styles);
};

const onTextAreaChange = function(e) {
    const name = themeSelector.val();

    if (name.trim() === '') { return; }

    const newStyles = e.getValue();
    stylesService.saveTheme(name, newStyles);
    handleStylesChange(newStyles);
};

const onThemeRemove = function() {
    const name = themeSelector.val();
    themeSelector.find('option').filter(`[value="${name}"]`).remove();
    const list = getThemesList();
    stylesService.removeTheme(name, list).then(function() {
        themeSelector.trigger('change');
    });
};

const onThemeNameInput = function(e) {
    if (e.keyCode !== enterKey) { return; }
    e.preventDefault();

    const name = newThemeNameInput.val();

    if (name.trim() === '') { return; }

    if (themeNameIsNew(name)) {
        themeSelector.append(getThemeItem(name));
        stylesService.addTheme(name, '', getThemesList());
        newThemeNameInput.val('');
        addThemeButton.trigger('click');
    } else {
        dialogs.notification('Theme with that name already exist', function() {
            newThemeNameInput.focus();
        });
    }
};

const onThemeSelect = function() {
    const name = themeSelector.val();
    const styles = stylesService.getStyles(name);
    renderStyles(styles);
    handleStylesChange(styles);
    stylesService.saveActiveTheme(name);
};

const init = function() {
    textarea.on('changes', onTextAreaChange);
    tabContent.on('click', '#themeRemove', onThemeRemove);
    newThemeNameInput.on('keydown', onThemeNameInput);
    tabContent.on('select change', '#themeSelector', onThemeSelect);
    togglePair.connect(addThemeButton, newThemeNameInput);
};

const renderThemesList = function(list) {
    list.forEach(function(name) {
        const option = getThemeItem(name);
        themeSelector.append(option);
    });
};

const onThemesLoaded = function() {
    settings.fetchSetting('activeTheme').then(function(data) {
        themeSelector.val(data.activeTheme).trigger('change');
    });
};

const refresh = function() {
    textarea.refresh();
};

const onSettingsLoad = function() {
    const value = settings.store.get('themesList');
    renderThemesList(value);
    stylesService.loadThemes(value).then(onThemesLoaded);
};

const onStylesChange = styleChangeHandlers.add.bind(styleChangeHandlers);

settings.onLoad(onSettingsLoad);

module.exports = {
    init,
    renderStyles,
    onStylesChange,
    refresh
};
