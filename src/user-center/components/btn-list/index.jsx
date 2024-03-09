/**
 * @file 按钮列表
 */

import React from 'react';
import icon from '../../../../resource/img/credit-icon.png';
import './index.less';


export const BtnList = (props) => {
    return <div className='btn-list-box'>
        <div className='btn-item invite' onClick={props.onInvite}>
            <div className='btn-text'>Invite</div>
            <div className='credit-count'>
                <img src={icon} />
                <span>0.2 Credit each</span>
            </div>
        </div>
        <div className='btn-item get-credit' onClick={props.onGetCredit}>
            <div className='btn-text'>Get Credit</div>
            <div className='credit-count'>
                <img src={icon} />
                <span>0.2 Credit each</span>
            </div>
        </div>
    </div>
};