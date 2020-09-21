const Bot = require("../bot/bot");

module.exports = () => {
  setTimeout(() => {
    const bot = new Bot(3, 1200, false);
    bot.initialize();
  }, 2000);
};
