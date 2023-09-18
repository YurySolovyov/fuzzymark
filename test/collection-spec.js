import { test } from 'uvu';
import * as assert from 'uvu/assert';

import collection from '../src/frontend/bookmarks/collection.js';
import helper from './helpers/collection-helper.js';

const settingsProvider = () => ({
  store: new Map([
    ['propertyKey', 'title'],
    ['maxResults', 20]
  ])
});

test('transforms bookmarks to flat array', () => {
  const transformed = collection.transform(helper.bookmarks, settingsProvider);
  
  for (const item of transformed) {
    assert.not.equal(item, null);
    assert.type(item, 'object');
  }
});

test('creates titles from urls if title is empty', () => {
  const transformed = collection.transform(helper.bookmarks, settingsProvider);
  const titles = transformed.map(t => t.title);
  
  assert.equal(titles, [
    'twitter.com',
    'geektimes.ru',
    'web.skype.com/ru/'
  ]);
});

test('assigns paths to bookmarks', () => {
  const transformed = collection.transform(helper.bookmarks, settingsProvider);
  const paths = transformed.map(t => t.path);
  
  assert.equal(paths, [
    'social',
    'social/nested',
    'social/nested'
  ]);
});

test('assigns favicons to bookmarks', () => {
  const transformed = collection.transform(helper.bookmarks, settingsProvider);
  const favicons = transformed.map(t => t.favicon);
  
  assert.equal(favicons, [
    'https://twitter.com/favicon.ico',
    'http://geektimes.ru/favicon.ico',
    'https://web.skype.com/favicon.ico',
  ]);
});

test.run();
