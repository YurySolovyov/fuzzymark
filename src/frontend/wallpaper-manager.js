// local one does not perform sync
const storage = chrome.storage.local;

const save = (value) => {
  return new Promise((resolve, _reject) => {
    storage.set({ wallpaper: value }, resolve);
  });
};

const get = () => {
  return new Promise((resolve, _reject) => {
    storage.get('wallpaper', (res) => resolve(res.wallpaper));
  });
};

const clear = () => {
  return new Promise((resolve, _reject) => {
    storage.remove(['wallpaper', 'wallpaper-fit-mode'], resolve);
  });
};

const getOpacity = () => {
  return new Promise((resolve, _reject) => {
    storage.get('wallpaper-opacity', (res) => resolve(res['wallpaper-opacity']));
  });
};

const setOpacity = (value) => {
  return new Promise((resolve, _reject) => {
    storage.set({ 'wallpaper-opacity': value }, resolve);
  });
};

const getFitMode = () => {
  return new Promise((resolve, _reject) => {
    storage.get('wallpaper-fit-mode', (res) => resolve(res['wallpaper-fit-mode']));
  });
};

const setFitMode = (value) => {
  return new Promise((resolve, _reject) => {
    storage.set({ 'wallpaper-fit-mode': value }, resolve);
  });
};

export default {
  save,
  get,
  clear,
  getOpacity,
  setOpacity,
  getFitMode,
  setFitMode,
};
