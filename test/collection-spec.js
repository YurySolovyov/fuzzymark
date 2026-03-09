import { describe, it, expect } from 'vitest';

import collection from '../src/frontend/bookmarks/collection.js';
import helper from './helpers/collection-helper.js';

const settingsProvider = () => ({
  store: new Map([
    ['propertyKey', 'title'],
    ['maxResults', 20],
  ]),
});

describe('collection', () => {
  it('transforms bookmarks to flat array', () => {
    const transformed = collection.transform(helper.bookmarks, settingsProvider);

    for (const item of transformed) {
      expect(item).not.toBeNull();
      expect(typeof item).toBe('object');
    }
  });

  it('creates titles from urls if title is empty', () => {
    const transformed = collection.transform(helper.bookmarks, settingsProvider);
    const titles = transformed.map((t) => t.title);

    expect(titles).toEqual(['twitter.com', 'geektimes.ru', 'web.skype.com/ru/']);
  });

  it('assigns paths to bookmarks', () => {
    const transformed = collection.transform(helper.bookmarks, settingsProvider);
    const paths = transformed.map((t) => t.path);

    expect(paths).toEqual(['social', 'social/nested', 'social/nested']);
  });

  it('assigns favicons to bookmarks', () => {
    const transformed = collection.transform(helper.bookmarks, settingsProvider);
    const favicons = transformed.map((t) => t.favicon);

    expect(favicons).toEqual([
      'https://twitter.com/favicon.ico',
      'http://geektimes.ru/favicon.ico',
      'https://web.skype.com/favicon.ico',
    ]);
  });

  it('tolerates invalid bookmark urls', () => {
    const transformed = collection.transform(
      helper.bookmarks.concat([
        {
          dateAdded: 1344519750406,
          id: '10',
          index: 2,
          parentId: '1',
          title: 'Broken',
          url: 'notaurl',
        },
      ]),
      settingsProvider,
    );

    expect(transformed.at(-1)).toMatchObject({
      favicon: '',
      title: 'notaurl',
      url: 'notaurl',
      valid: false,
    });
  });
});
