const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const marked = require('marked');
const escapers = require("@telegraf/entity");
const axios = require('axios/index.cjs');

const TOKEN = '6330359560:AAFNMvSVcS-e6KKWWkM_A9qAocxx_DecuVU';

const bot = new Telegraf(TOKEN);

const web_link = 'https://deepfun.xyz/user-center/';

// 发送游戏
bot.start((ctx) => {
    ctx.sendGame('play2earn');
});

bot.inlineQuery((ctx) => {
    console.log('[inlineQuery]', query);
});

bot.on('inline_query', (ctx) => {
    console.log('[inline_query]', ctx);
});

bot.on('callback_query', (ctx) => {
    console.log('[callback_query]', ctx, ctx.update.callback_query.from);
    const uid = ctx.update.callback_query.from.id;
    // axios.post(`https://api.telegram.org/bot${TOKEN}/setGameScore`, {
    //     score: 1,
    //     user_id: ctx.update.callback_query.from.id,
    //     inline_message_id: ctx.update.callback_query.inline_message_id,
    // }).then(res => {
    //     console.log('[axios post res]', res.status, res.data);
    // }).catch(e => {
    //     console.log('[axios post error]', e);
    // });
    ctx.answerGameQuery(`${web_link}?uid=${uid}`);
})

bot.on(message('users_shared'), (ctx) => {
    console.log('on shared', ctx);
});

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));


bot.launch();