'use strict';

const collection = require('../src/frontend/bookmarks/collection');
const helper = require('./helpers/collection-helper');
const _ = require('lodash');

describe('Bookmarks collection', function() {

    describe('Bookmarks transformation', function() {
        let transformed;
        const settings = {
            store: new Map([
                ['propertyKey', 'title'],
                ['maxResults', 20]
            ])
        };
        const settingsProvider = () => settings;
        beforeEach(function() {
            transformed = collection.transform(helper.bookmarks, settingsProvider);
        });

        it('transforms bookmarks to flat array', function() {
            expect(transformed).toBeArrayOfObjects();
        });

        it('creates titles from urls if title is empty', function() {
            const titles = _.map(transformed, 'title');
            expect(titles).toBeArrayOfStrings();
            expect(titles).toEqual([
                'twitter.com',
                'geektimes.ru',
                'web.skype.com/ru/'
            ]);
        });

        it('assigns paths to bookmarks', function() {
            const titles = _.map(transformed, 'path');
            expect(titles).toBeArrayOfStrings();
            expect(titles).toEqual([
                'social',
                'social/nested',
                'social/nested'
            ]);
        });

        it('assigns favicons to bookmarks', function() {
            const favicons = _.map(transformed, 'favicon');
            expect(favicons).toBeArrayOfStrings();
            expect(favicons).toEqual([
                'chrome://favicon/https://twitter.com/',
                'chrome://favicon/http://geektimes.ru/',
                'chrome://favicon/https://web.skype.com/ru/',
            ]);
        });
    });

    describe('Bookmarks loading', function() {

        beforeAll(function() {
            window.chrome.bookmarks = {
                getTree: function(callback) {
                    _.defer(callback, helper.bookmarks);
                }
            };
        });

        it('loads bookmarks', function() {
            spyOn(window.chrome.bookmarks, 'getTree').and.callThrough();

            collection.load().then(function(data) {
                expect(window.charome.bookmarks.getTree).toHaveBeenCalled();
                expect(data).toBeArrayOfObjects();
            });
        });

    });

});
