'use strict';

const fetchFromStorage = function(key) {
  return new Promise(function(resolve) {
    chrome.storage.sync.get(key, resolve);
  });
};

const setInStorage = function(key, value) {
  return new Promise(function(resolve) {
    const obj = { [key]: value };
    chrome.storage.sync.set(obj, resolve);
  });
};

const deleteFromStorage = function(key) {
  return new Promise(function(resolve) {
    chrome.storage.sync.remove(key, resolve);
  });
};

const fetchIds = async function() {
  const ids = (await fetchFromStorage('tiles')).tiles;
  return ids || [];
};

const fetchAll = async function() {
  const tileIds = await fetchIds();
  const tiles = await fetchFromStorage(tileIds);

  return tileIds.map(function(id) {
    const tile = tiles[id];
    return Object.assign({
      favicon: 'chrome://favicon/' + tile.url,
      id
    }, tile);
  });
};

const saveTile = async function(id, tile) {
  await setInStorage(id, tile);
};

const saveNewTile = async function(id, tile) {
  const ids = await fetchIds();
  await setInStorage('tiles', ids.concat(id));
  await saveTile(id, tile);
};

const deleteTile = async function(id) {
  const newIds = (await fetchIds()).filter(function(tileId) {
    return id !== tileId;
  });

  await setInStorage('tiles', newIds);
  await deleteFromStorage(id);
};

module.exports = {
  fetchAll,
  saveNewTile,
  saveTile,
  delete: deleteTile
};
