import faivconUrl from './favicon-url.js';
import browser from './browser.js';
import { parseInputUrl, parseStoredUrl } from '../../shared/bookmark-url.js';

const fetchFromStorage = (key) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, resolve);
  });
};

const setInStorage = (key, value) => {
  return new Promise((resolve) => {
    const obj = { [key]: value };
    chrome.storage.sync.set(obj, resolve);
  });
};

const deleteFromStorage = (key) => {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(key, resolve);
  });
};

const fetchIds = async () => {
  const result = await fetchFromStorage('tiles');
  return Array.isArray(result.tiles) ? result.tiles.filter((id) => typeof id === 'string') : [];
};

const normalizeTile = (id, tile, kind) => {
  const value = tile && typeof tile === 'object' ? tile : {};
  const title = typeof value.title === 'string' ? value.title : '';
  const [valid, url] = parseStoredUrl(value.url);

  return {
    favicon: valid ? faivconUrl(url, kind) : '',
    id,
    title,
    url,
    valid,
  };
};

const sanitizeTile = (tile) => {
  const value = tile && typeof tile === 'object' ? tile : {};
  const [valid, url] = parseInputUrl(value.url);

  if (!valid) {
    return null;
  }

  return {
    title: typeof value.title === 'string' ? value.title.trim() : '',
    url,
  };
};

const fetchAll = async () => {
  const tileIds = await fetchIds();
  const tiles = await fetchFromStorage(tileIds);
  const kind = browser();

  return tileIds.map((id) => {
    return normalizeTile(id, tiles[id], kind);
  });
};

const saveTileIds = (ids) => setInStorage('tiles', ids);
const saveTile = (id, tile) => {
  const sanitizedTile = sanitizeTile(tile);

  if (!sanitizedTile) {
    return Promise.resolve(false);
  }

  return setInStorage(id, sanitizedTile).then(() => true);
};

const saveNewTile = async (id, tile) => {
  const ids = await fetchIds();
  const saved = await saveTile(id, tile);

  if (!saved) {
    return false;
  }

  await saveTileIds(ids.concat(id));
  return true;
};

const deleteTile = async (id) => {
  const ids = await fetchIds();
  const newIds = ids.filter((tileId) => tileId !== id);

  await saveTileIds(newIds);
  await deleteFromStorage(id);
};

export default {
  fetchAll,
  saveNewTile,
  saveTile,
  saveTileIds,
  deleteTile,
};
