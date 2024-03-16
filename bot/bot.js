const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const marked = require('marked');
const escapers = require("@telegraf/entity");


const bot = new Telegraf('7120135953:AAHluMRnb8yiIJaWlW2psfJyG9Ftf2jXQWk', {
    telegram: {
        testEnv: true,
    }
});

const web_link = 'https://deepfun.xyz/user-center/';


bot.start((ctx) => {
    ctx.replyWithPhoto('https://game.deepfun.xyz/thumbnails/1.jpg', {
        reply_markup: {
            // inline_keyboard: [[{ text: 'Play to earn', web_app: { url: web_link } }]],
        },
        caption: "this is for a image test",
    });
});


bot.on(message('users_shared'), (ctx) => {
    console.log('on shared', ctx);
});

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));


bot.launch()