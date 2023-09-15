import collection from '../src/frontend/bookmarks/collection';
import helper from './helpers/collection-helper';

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
      const titles = transformed.map(t => t.title);
      expect(titles).toBeArrayOfStrings();
      expect(titles).toEqual([
        'twitter.com',
        'geektimes.ru',
        'web.skype.com/ru/'
      ]);
    });

    it('assigns paths to bookmarks', function() {
      const paths = transformed.map(t => t.path);
      expect(paths).toBeArrayOfStrings();
      expect(paths).toEqual([
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
      window.chrome = window.chrome || {
        runtime: {
          getURL(postfix) {
            return `${window.location.origin}${postfix}`;
          },
        },

        bookmarks: {
          getTree: function(callback) {
            window.setTimeout(() => callback(helper.bookmarks), 1);
          }
        }
      };
    });

    it('loads bookmarks', function() {
      spyOn(window.chrome.bookmarks, 'getTree').and.callThrough();

      collection.load().then(function(data) {
        expect(window.chrome.bookmarks.getTree).toHaveBeenCalled();
        expect(data).toBeArrayOfObjects();
      });
    });

  });

});
