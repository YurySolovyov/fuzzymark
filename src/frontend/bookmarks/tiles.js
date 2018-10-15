'use strict';

const faivconUrl = require('./favicon-url.js');

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
      favicon: faivconUrl(tile.url),
      id
    }, tile);
  });
};

const saveTileIds = function(ids) {
  return setInStorage('tiles', ids);
};

const saveTile = function(id, tile) {
  return setInStorage(id, tile);
};

const saveNewTile = async function(id, tile) {
  const ids = await fetchIds();
  await saveTileIds(ids.concat(id));
  await saveTile(id, tile);
};

const deleteTile = async function(id) {
  const newIds = (await fetchIds()).filter(function(tileId) {
    return id !== tileId;
  });

  await saveTileIds(newIds);
  await deleteFromStorage(id);
};

module.exports = {
  fetchAll,
  saveNewTile,
  saveTile,
  saveTileIds,
  deleteTile
};
