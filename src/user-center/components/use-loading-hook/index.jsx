/**
 * @file 加载态
 */

import React, { useState, useEffect } from 'react';
import loadingImg from '../../../../resource/img/loading.png';
import './index.less';

export const useLoading = () => {
    const [isLoading, setIsloading] = useState(false);

    const showLoading = () => {
        setIsloading(true);
    };

    const stopLoading = () => {
        setIsloading(false);
    };

    useEffect(() => {
        if(isLoading === true) {
            const htmlStr = `<img class='loading-box' src="${loadingImg}"></img>`;
            const el = document.createElement('div');
            el.classList.add('custom-loading-mask')
            el.innerHTML = htmlStr;
            document.body.appendChild(el);
        } else {
            document.querySelector('.custom-loading-mask')?.remove();
        }
    }, [isLoading]);

    return {
        showLoading,
        stopLoading,
        isLoading,
    };
};