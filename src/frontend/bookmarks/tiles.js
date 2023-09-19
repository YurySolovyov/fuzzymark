import faivconUrl from './favicon-url.js';
import browser from './browser.js';

const fetchFromStorage = key => {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, resolve);
  });
};

const setInStorage = (key, value) => {
  return new Promise(resolve => {
    const obj = { [key]: value };
    chrome.storage.sync.set(obj, resolve);
  });
};

const deleteFromStorage = key => {
  return new Promise(resolve => {
    chrome.storage.sync.remove(key, resolve);
  });
};

const fetchIds = async () => {
  const result = await fetchFromStorage('tiles');
  return result.tiles || [];
};

const fetchAll = async () => {
  const tileIds = await fetchIds();
  const tiles = await fetchFromStorage(tileIds);
  const kind = browser();

  return tileIds.map(id => {
    const tile = tiles[id];
    
    return {
      favicon: faivconUrl(tile.url, kind),
      id,
      ...tile,
    };
  });
};

const saveTileIds = ids => setInStorage('tiles', ids);
const saveTile = (id, tile) => setInStorage(id, tile);

const saveNewTile = async (id, tile) => {
  const ids = await fetchIds();
  await saveTileIds(ids.concat(id));
  await saveTile(id, tile);
};

const deleteTile = async id => {
  const ids = await fetchIds();
  const newIds = ids.filter(tileId => tileId !== id);

  await saveTileIds(newIds);
  await deleteFromStorage(id);
};

export default {
  fetchAll,
  saveNewTile,
  saveTile,
  saveTileIds,
  deleteTile
};
