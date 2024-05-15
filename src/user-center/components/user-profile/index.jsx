/**
 * @file 用户信息
 */

import React from 'react';
import defaultUserAvatar from '../../../../resource/img/default-avatar.png';
import creditsIconImg from '../../../../resource/img/credit-icon.png'; 
import { lang } from '../../language';
import './index.less';

export const UserProfile = (props) => {
    return <div className='user-profile-box'>
        <img src={props.avatar ?? defaultUserAvatar} />
        <span>{props.name ?? '-' }</span>
        <div className='placeholder'></div>
        <div className='credits-box'>
            <div className='credits-desc'>{lang('userinfo.credits')}</div>
            <div className='credits-data'>
                <img src={creditsIconImg} />
                <span>{props.credits}</span>
            </div>
        </div>
    </div>
};