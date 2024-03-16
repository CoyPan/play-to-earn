/**
 * @file 多语言
 */


const TEXTS_DICT = {
    'en': {
        routlette: {
            done: 'congratulations'.toUpperCase(),
            hint: 'Spin The Wheel Get Your New User Benefit',
        },
        section: {
            title: 'Quick Credit',

        },
        btn: {
            daily: 'Daily Credit',
            invite: 'Invite',
            get: 'Get Credit',
        },
        credit: 'Credit each',
        popup: {
            title: 'CREDITS FOR YOU',
            btn: 'Receive',
        },
    }
};

const la = TEXTS_DICT['en'];
const cache = {};

export const lang = (key) => {
    if (cache[key]) {
        return cache[key];
    }
    const arr = key.split('.');
    let cur = la;
    while (arr.length) {
        cur = cur[arr.shift()]
    }
    cache[key] = cur;
    return cur;
}