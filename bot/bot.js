const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf('7120135953:AAHluMRnb8yiIJaWlW2psfJyG9Ftf2jXQWk');

const web_link = 'https://deepfun.xyz/game-center/';

bot.start((ctx) => {
    ctx.reply('Welcome 123', {
        reply_markup: {
            inline_keyboard: [[{ text: 'Play to earn', web_app: { url: web_link } }]],
        }
    })
});

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));


bot.launch()