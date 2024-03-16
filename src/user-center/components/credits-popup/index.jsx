/**
 * @file 获得了credit的popup
 */

import React from 'react';
import { lang } from '../../language';
import popupBgUp from '../../../../resource/img/credits-popup-bg-up.png';
import popupBg from '../../../../resource/img/credits-popup-bg.png';
import popupTitleBg from '../../../../resource/img/credits-popup-title.png';
import './index.less';

export const CreditsPopup = (props) => {
    return <div className='credits-popup-mask' onClick={() => { props.onClose?.() }}>
        <div className='credits-box'>
            <div className='popup-bg-up' style={{ backgroundImage : `url(${popupBgUp})`}}></div>
            <div className='popup-bg' style={{ backgroundImage: `url(${popupBg})`}}>
                <div className='credits-number-box'>
                    <span>{props.credits}</span> Credits
                </div>
            </div>
            <div className='popup-title-bg' style={{ backgroundImage: `url(${popupTitleBg})`}}>{lang('popup.title')}</div>
            <div className='popup-btn'>{lang('popup.btn')}</div>
        </div>
    </div>
};