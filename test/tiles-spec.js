import { describe, it, expect } from 'vitest';

import { addBookmarkDates } from '../src/frontend/bookmarks/tiles.js';

describe('tiles', () => {
  it('adds dates from the matching browser bookmark', () => {
    const tiles = [{ id: 'tile-1', title: 'Example', url: 'https://example.com/' }];
    const bookmarks = [
      {
        id: 'bookmark-1',
        url: 'https://example.com/',
        dateAdded: 1710000000000,
        dateLastUsed: 1720000000000,
      },
    ];

    expect(addBookmarkDates(tiles, bookmarks)).toEqual([
      {
        ...tiles[0],
        dateAdded: 1710000000000,
        dateLastUsed: 1720000000000,
      },
    ]);
  });

  it('leaves tiles without a matching browser bookmark unchanged', () => {
    const tile = { id: 'tile-1', title: 'Example', url: 'https://example.com/' };

    expect(addBookmarkDates([tile], [])).toEqual([tile]);
  });
});
