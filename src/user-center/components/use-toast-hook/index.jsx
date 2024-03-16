/**
 * @file toast提示
 */

import React, { useEffect, useState } from 'react';
import './index.less';

export const useToast = () => {
    const [isShowToast, setIsShowToast] = useState(false);
    const [text, setText] = useState('');

    const showToast = (text) => {
        setIsShowToast(true);
        setText(text);
    };

    useEffect(() => {
        if (isShowToast === true && text) {
            const el = document.createElement('div');
            el.classList.add('custom-toast-box')
            el.innerHTML = text;
            document.body.appendChild(el);
        } else if (isShowToast === false) {
            document.querySelector('.custom-toast-box')?.remove();
            setText('');
        }
    }, [isShowToast, text]);

    useEffect(() => {
        if(isShowToast === true) {
            const timer = setTimeout(() => {
                setIsShowToast(false);
            }, 2000);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [isShowToast]);

    return {
        showToast,
    }
};