const axios = require('axios');
const os = require('os');

const regularQueryInterval = 60 * 60 * 1000;
const alertQueryInterval = 5 * 60 * 1000;

var TelegramBot = require('node-telegram-bot-api'),
  // Be sure to replace YOUR_BOT_TOKEN with your actual bot token on this line.
  telegram = new TelegramBot('1084802913:AAHxI16Kn1BbkE9GbTrnYcNegmkwrM-gYcU', {
    polling: true,
  });
const chatId = '-1001339451247';

const App = async () => {
  // telegram bot shall check out the state every 5mins, if everything ok, no warnings

  // telegram bot shall check out and print out state every 60mins

  setInterval(query, alertQueryInterval);
  setInterval(regularQuery, regularQueryInterval);
};

const checkNode = async () => {
  let response = await axios.post(
    'http://localhost:9901',
    { id: 1, jsonrpc: '2.0', method: 'system_health', params: [] },
    { headers: { 'content-type': 'application/json' } }
  );
  let result = response.data.result;

  let officialBlock = await checkBlock(`https://rpc-sitara.stafi.io`);
  let myBlock = await checkBlock(`http://localhost:9901`);
  let mySystem = await checkVersion(`http://localhost:9901`);

  return {
    isSync: result.isSyncing,
    peers: result.peers,
    officialBlock: parseInt(officialBlock),
    myBlock: parseInt(myBlock),
    mySystem: mySystem,
  };
};

const query = async () => {
  let info = await checkNode();
  if (info.peers < 10) {
    await telegram.sendMessage(chatId, 'not enough peers!!!');
    console.log('not enough peers');
  }

  if (info.officialBlock - info.myBlock > 10) {
    console.log('node falling behind');
    await telegram.sendMessage(chatId, 'node falling behind!!!');
  }
};

const regularQuery = async () => {
  let info = await checkNode();
  let message = `stafi node has ${info.peers} peers, Block at ${info.myBlock}, Official Block at ${info.officialBlock}, system: ${info.mySystem}`;
  await telegram.sendMessage(chatId, message);
  console.log(message);
};

const checkBlock = async (url) => {
  let response = await axios.post(
    url,
    { id: 1, jsonrpc: '2.0', method: 'chain_getHeader', params: [] },
    { headers: { 'content-type': 'application/json' } }
  );
  let result = response.data.result;
  return result.number;
};

const checkVersion = async (url) => {
  let response = await axios.post(
    url,
    { id: 1, jsonrpc: '2.0', method: 'system_version', params: [] },
    { headers: { 'content-type': 'application/json' } }
  );
  let result = response.data.result;
  return result;
};

App();
