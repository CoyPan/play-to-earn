/**
 * @file 一些工具函数
 */

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
        zoneId: 2050, // required: the zone ID from the "Games" page
        accountId: 8013,  // optional: your account ID (required for RMS)
        gameId: 8548, 
        siteId: 8548,
        userId: getUserId(), // required: UUID value for current customer (required for targeted ads - UUID4 recommended)
        // custom: nnnn, // optional: custom value for RMS - use to provide additional reward information
        adStatusCb: cb, // required: callback function to provide information regarding ad status
        vSize: isPC() ? '1024x768' : 'max',
        vSizeM: 'max',
    };
    console.log('[options]', options);
    invokeApplixirVideoUnit(options);
}