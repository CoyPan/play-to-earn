/**
 * @file 按钮列表
 */

import React from 'react';
import icon from '../../../../resource/img/credit-icon.png';
import './index.less';
import { lang } from '../../language';

export const BtnList = (props) => {
    return <div className='btn-list-box'>
        <div className='btn-item invite' onClick={props.onDailyCredit}>
            <div className='btn-text'>{lang('btn.daily')}</div>
            <div className='credit-count'>
                <img src={icon} />
                <span>0.5 {lang('credit')}</span>
            </div>
        </div>
        <div className='btn-item get-credit' onClick={props.onGetCredit}>
            <div className='btn-text'>{lang('btn.get')}</div>
            <div className='credit-count'>
                <img src={icon} />
                <span>0.2 {lang('credit')}</span>
            </div>
        </div>
    </div>
};