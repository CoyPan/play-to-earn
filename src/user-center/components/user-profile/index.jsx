/**
 * @file 用户信息
 */

import React from 'react';
import defaultUserAvatar from '../../../../resource/img/default-avatar.png';
import './index.less';

export const UserProfile = (props) => {
    return <div className='user-profile-box'>
        <img src={props.avatar ?? defaultUserAvatar} />
        <span>{props.name ?? 'Bob' }</span>
    </div>
};