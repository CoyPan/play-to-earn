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
            game: 'Game For You',
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
        daily: {
            btn: 'Receive',
            already: 'already got the credit today',
        },
        ad: {
            error: 'load ad error',
        },
        network: {
            get_user_info_error: 'get user info error', 
            get_user_profile_error: 'get_user_profile_error',
        },
        userinfo: {
            credits: 'My Credits'
        }
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