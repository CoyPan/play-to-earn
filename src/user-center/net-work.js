/**
 * @file 网络请求相关
 */

import axios from 'axios';

const URLS = {
    'getCredits': 'https://net-earn.deepfun.xyz/user/get/credits',
    'editCredits': 'https://net-earn.deepfun.xyz/user/edit/credits',
};

// 获取用户信息
export const getUserInfoById = async (uid) => {
    try {
        const res = await axios.post(URLS.getCredits, {
            user_id: Number(uid),
        });
        console.log('[getUserInfoById]', res);
        if(res?.data?.code === 200) {
            return res.data.data;
        }
        return false;
    } catch(e) {
        console.error('[getUserInfoById error]', e);
        return false;
    }
};

// 设置用户的credits
export const setUserCreditsById = async (uid, credits) => {
    try {
        const res = await axios.post(URLS.editCredits, {
            user_id: Number(uid),
            credits: parseFloat(credits),
        });
        console.log('[setUserCreditsById]', res);
        if(res?.data?.code === 200) {
            return true;
        }
        return false;
    } catch(e) {
        console.error('[setUserCreditsById error]', e);
        return false;
    }
};