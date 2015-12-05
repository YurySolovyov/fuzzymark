'use strict';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/css/css');

const $ = require('jquery');
const CodeMirror = require('codemirror');
const settings = require('./settings');

const styleChangeHandlers = $.Callbacks();

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

let textarea;
const initialize = function() {
    textarea = CodeMirror($('#styleCss').get(0), editorOptions);
    textarea.on('changes', function(e) {
        const newStyles = e.getValue();
        settings.triggerChange('styleCss', newStyles);
        handleStylesChange(newStyles);
    });
};

const renderStyles = function(styles) {
    textarea.setOption('value', styles);
};

const refresh = function() {
    textarea.refresh();
};

settings.onLoad(function(key, value) {
    if (key === 'styleCss') {
        renderStyles(value);
    }
});

module.exports = {
    init: initialize,
    renderStyles: renderStyles,
    onStylesChange: styleChangeHandlers.add.bind(styleChangeHandlers),
    refresh: refresh
};
