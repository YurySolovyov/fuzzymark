'use strict';

const fetchStorage = function(key) {
  return new Promise(function(resolve) {
    chrome.storage.sync.get(key, resolve);
  });
};

const setStorage = function(key, value) {
  return new Promise(function(resolve) {
    const obj = { [key]: value };
    chrome.storage.sync.set(obj, resolve);
  });
};

const fetchIds = async function() {
  const ids = (await fetchStorage('tiles')).tiles;
  return ids || [];
};

const fetchAll = async function() {
  const tileIds = await fetchIds();
  const tiles = await fetchStorage(tileIds);

  return tileIds.map(function(id) {
    const tile = tiles[id];
    return Object.assign({
      favicon: 'chrome://favicon/' + tile.url,
      id
    }, tile);
  });
};

const save = async function(id, tile) {
  const ids = await fetchIds();
  await setStorage('tiles', ids.concat(id));
  await setStorage(id, tile);
};

module.exports = {
  fetchAll,
  save
};
