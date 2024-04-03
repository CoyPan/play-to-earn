/**
 * @file 网络请求相关
 */

import axios from 'axios';
import CryptoJS from "crypto-js";

const baseUrl = location.hostname === 'localhost' ? '' : 'https://net-earn.deepfun.xyz'; 

const URLS = {
    'getCredits': baseUrl + '/user/get/credits',
    'editCredits': baseUrl + '/user/edit/credits',
    'doSignin': baseUrl + '/user/signin/add',
    'getSigninList': baseUrl + '/user/signin/list',
};

const key = CryptoJS.enc.Utf8.parse("77258c46234dc2d3e9cc15e4920deec3"); //16位
const iv = CryptoJS.enc.Utf8.parse("1a827df919a32ccd");

const encrypt = (word) => {
    let encrypted = "";
    if (typeof word == "string") {
        const srcs = CryptoJS.enc.Utf8.parse(word);
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    } else if (typeof word == "object") {
        //对象格式的转成json字符串
        const data = JSON.stringify(word);
        const srcs = CryptoJS.enc.Utf8.parse(data);
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    }
    return encrypted.ciphertext.toString();
};

// 生成请求的时间戳
const generateTimeStamp = () => {
    return Math.floor(Date.now() / 1000);
};

const addZero = (num) => {
    if(num < 10) {
        return '0' + num;
    }
    return num;
};

// 签到的一些方法
const signHandler = {
    // 当前签到月份
    getSigninMonth: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = addZero(now.getMonth() + 1);
        return `${year}-${month}`;
    },
    // 获取上月签到月份
    getLastSigninMonth: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = addZero(now.getMonth());
        return `${year}-${month}`;
    },
    // 获取今天的签到日期
    getSigninDate: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = addZero(now.getMonth() + 1);
        const date = addZero(now.getDate());
        return `${year}-${month}-${date}`;
    },
    // 获取今日日期
    getCurDate: () => {
        return new Date().getDate();
    },
    getSigninTime: generateTimeStamp,
}

// 获取用户信息
export const getUserInfoById = async (uid) => {
    const data = {
        user_id: Number(uid),
        timestamp: generateTimeStamp(),
    };
    try {
        const res = await axios.post(URLS.getCredits, data, {
            headers: {
                sign: encrypt(JSON.stringify(data)),
            }
        });
        console.log('[getUserInfoById]', res);
        if (res?.data?.code === 200) {
            return res.data.data;
        }
        return false;
    } catch (e) {
        console.error('[getUserInfoById error]', e);
        return false;
    }
};

// 设置用户的credits
export const setUserCreditsById = async (uid, credits) => {
    const data = {
        user_id: Number(uid),
        credits: parseFloat(credits),
        timestamp: generateTimeStamp(),
    };
    try {
        const res = await axios.post(URLS.editCredits, data, {
            headers: {
                sign: encrypt(JSON.stringify(data)),
            }
        });
        console.log('[setUserCreditsById]', res);
        if (res?.data?.code === 200) {
            return true;
        }
        return false;
    } catch (e) {
        console.error('[setUserCreditsById error]', e);
        return false;
    }
};


// 每日签到
export const doDailySignIn = async (useid) => {
    const data = {
        user_id: Number(useid),
        sign_in_month: signHandler.getSigninMonth(),
        sign_in_date: signHandler.getSigninDate(),
        sign_in_time: signHandler.getSigninTime(),
        timestamp: generateTimeStamp(),
    };
    try {
        const res = await axios.post(URLS.doSignin, data, {
            headers: {
                sign: encrypt(JSON.stringify(data)),
            }
        });
        console.log('[doDailySignIn]', res);
        if (res?.data?.code === 200) {
            return true;
        }
        return false;
    } catch (e) {
        console.error('[setUserCreditsById error]', e);
        return false;
    }
};

// 获取当前签到的天数, 以及当天是否已签到
export const getCurSigninStatus = async (useid) => {
    const dayCount = 7;
    const data = {
        user_id: Number(useid),
        timestamp: generateTimeStamp(),
        sign_in_month: signHandler.getSigninMonth(),
    };
    try {
        const res = await axios.post(URLS.getSigninList, data, {
            headers: {
                sign: encrypt(JSON.stringify(data)),
            },
        });
        console.log('[getCurSigninStatus]', res);
        if(res?.data?.code !== 200) {
            return false;
        }
        const list = res.data?.data?.list ?? [];
        // 如果当前是某月的第七天后，则可以直接判断连续签到了多少天
        if(signHandler.getCurDate() >= dayCount) {
            return checkSigninDayCount(list);
        }
        // 当前是某月的前7天，则还需要计算上个月签到的时间
        data.sign_in_month = signHandler.getLastSigninMonth();
        const lastRes = await axios.post(URLS.getSigninList, data, {
            headers: {
                sign: encrypt(JSON.stringify(data)),
            },
        });
        if(lastRes?.data?.code !== 200) {
            return false;
        }
        const newList = lastRes.data?.data?.list ?? [];
        const allList = newList.concat(list);
        return checkSigninDayCount(allList);
    } catch (e) {
        console.error('[setUserCreditsById error]', e);
        return false;
    }
};

// 根据签到的天数，判断连续签到了多少天
const checkSigninDayCount = (list) => {
    console.log('[checkSigninDayCount]', JSON.stringify(list));
    // 当天是否已经签到
    const todayIsSign = list[list.length - 1]?.sign_in_date === signHandler.getSigninDate();
    let sum = todayIsSign ? 1 : 0; // 一共签到了多少天
    let curDay;
    let lastDay;
    // 当前已经签到过了
    if(todayIsSign) {
        list.pop();
    }
    while(sum < 7) {
        lastDay = list.pop();
        if(!lastDay) {
            break;
        }
        curDay = curDay ? new Date(curDay).getTime() : new Date(`${signHandler.getSigninDate()}`).getTime();
        const lastTimeStamp = new Date(`${lastDay.sign_in_date}`).getTime();
        // 相差一天
        if(curDay - lastTimeStamp === 86400000) {
            sum += 1;
            curDay = lastDay.sign_in_date;
        } else {
            // 相差了两天
            break;
        }
    }
    return {
        todayIsSign,
        dayCount: sum,
    }
};