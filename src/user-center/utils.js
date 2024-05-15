/**
 * @file 一些工具函数
 */

import axios from "axios";

export function isPC() {
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) === false;
};

export function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function getUserId() {
    var curId = localStorage.getItem('uuid');
    if(curId) {
        return curId;
    }
    var newId = generateUUID();
    localStorage.setItem('uuid', newId);
    return newId;
}

export function openAd(cb) {
    const options = {   // see online documentation for additional informaiton
        zoneId: 6229, // required: the zone ID from the "Games" page
        accountId: 8013,  // optional: your account ID (required for RMS)
        gameId: 8588, 
        siteId: 8588,
        userId: getUserId(), // required: UUID value for current customer (required for targeted ads - UUID4 recommended)
        // custom: nnnn, // optional: custom value for RMS - use to provide additional reward information
        adStatusCb: cb, // required: callback function to provide information regarding ad status
        vSize: isPC() ? '1024x768' : 'max',
        vSizeM: 'max',
    };
    console.log('[options]', options);
    invokeApplixirVideoUnit(options);
}

// 处理canvas模糊问题的函数
export function getPixelRatio(context) {
    var backingStore = context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};

// 动画函数
export function ease(start, end, percentDone) {
    return end * percentDone * (2 - percentDone);
}

export const queryObject = (() => {
    try {
        const queryString = window.location.search.slice(1);
        const pairs = queryString.split('&');
        const result = {};
        pairs.forEach(function (item) {
            const pair = item.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        return JSON.parse(JSON.stringify(result));
    } catch (e) {
        return {};
    }
  })();


// 格式化base64格式的图片
export const formatImgBase64 = (str = '') => {
    if (!str) {
        return str;
    }
    if (str.indexOf('data:image/jpeg;base64,') === 0) {
        return str;
    }
    return `data:image/jpeg;base64,${str}`;
};