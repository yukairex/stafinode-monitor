const axios = require('axios');

var TelegramBot = require('node-telegram-bot-api'),
  // Be sure to replace YOUR_BOT_TOKEN with your actual bot token on this line.
  telegram = new TelegramBot('1157120336:AAFB71bzJGWIyUoTgUR275aYwYFI0lZEfPc', {
    polling: true,
  });
const chatId = '-1001316791310';

const App = async () => {
  data = await axios.get();
  console.log(data);
};

App();
