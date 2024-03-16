/**
 * @file 每日任务
 */

import React from 'react';
import { DAILY_TASK } from '../../const';
import { lang } from '../../language';
import dailyTaskBg from '../../../../resource/img/daily-task-bg.png';
import dailyItemActived from '../../../../resource/img/daily-item-actived.png';
import './index.less';

export const DailyTask = ({ curIdx, onClose } = {}) => {
    return <div className='daily-task-mask' onClick={() => { onClose?.(); }}>
        <div className='daily-task-box'>
            <div className='daily-task-panel' style={{ backgroundImage: `url(${dailyTaskBg})`}}>
                {DAILY_TASK.map((item, idx) => {
                    return <div className='daily-task-item' 
                        key={idx} 
                        data-index={idx} 
                        data-actived={curIdx === idx}>
                        <div className='day-index'>Day 0{idx + 1}</div>
                        <div className='day-credit'><span>{item}</span> Cre</div>
                        { curIdx === idx && <div className='day-actived' style={{ backgroundImage: `url(${dailyItemActived})`}}></div>}
                    </div>
                })}
            </div>
            <div className='daily-accept-btn'>
                {lang('daily.btn')}
            </div>
        </div>
    </div>
};