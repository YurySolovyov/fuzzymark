import messageService from './message-service';

const fetchAll = () => {
  return messageService.send('fetch-settings');
};

const fetchSetting = (key) => {
  return messageService.send('get-setting', { key });
};

const saveSetting = (key, value) => {
  return messageService.send('set-setting', { key, value });
};

export default {
  fetchAll,
  fetchSetting,
  saveSetting,
};
