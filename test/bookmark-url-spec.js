import { describe, expect, it } from 'vitest';

import {
  getDisplayBookmarkUrl,
  parseInputUrl,
  parseStoredUrl,
} from '../src/shared/bookmark-url.js';

describe('bookmark url', () => {
  it('accepts bare host input and normalizes to http', () => {
    expect(parseInputUrl('chatgpt.com')).toEqual([true, 'http://chatgpt.com/']);
    expect(parseInputUrl('grafana')).toEqual([true, 'http://grafana/']);
  });

  it('accepts ip input and normalizes to http', () => {
    expect(parseInputUrl('127.0.0.1')).toEqual([true, 'http://127.0.0.1/']);
    expect(parseInputUrl('[::1]:3000')).toEqual([true, 'http://[::1]:3000/']);
  });

  it('accepts already parseable input as-is', () => {
    expect(parseInputUrl('chrome://extensions')).toEqual([true, 'chrome://extensions']);
    expect(parseInputUrl('about:config')).toEqual([true, 'about:config']);
    expect(parseInputUrl('http:chatgpt.com')).toEqual([true, 'http://chatgpt.com/']);
    expect(parseInputUrl('chrome:extensions')).toEqual([true, 'chrome:extensions']);
    expect(parseInputUrl('localhost:3000/foo')).toEqual([true, 'localhost:3000/foo']);
  });

  it('rejects values that still fail after http retry', () => {
    expect(parseInputUrl('')).toEqual([false, '']);
    expect(parseInputUrl('exa mple.com')).toEqual([false, '']);
  });

  it('accepts any parseable stored url and rejects invalid ones', () => {
    expect(parseStoredUrl('https://chatgpt.com')).toEqual([true, 'https://chatgpt.com/']);
    expect(parseStoredUrl('chrome://extensions')).toEqual([true, 'chrome://extensions']);
    expect(parseStoredUrl('http:chatgpt.com')).toEqual([true, 'http://chatgpt.com/']);
    expect(parseStoredUrl('notaurl')).toEqual([false, '']);
  });

  it('builds display values from valid urls and preserves invalid raw values', () => {
    expect(getDisplayBookmarkUrl('https://chatgpt.com/path')).toBe('chatgpt.com/path');
    expect(getDisplayBookmarkUrl('notaurl')).toBe('notaurl');
  });
});
