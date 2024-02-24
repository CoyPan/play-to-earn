/**
 * @file 付费金额选项
 */

import React from 'react';
import './index.css';

const OPTIONS = [
    {label: '12 Credits/$2', value: '2'},
    {label: '36 Credits/$5', value: '5'},
    {label: '85 Credits/$10', value: '10'},
    {label: '190 Credits/$20', value: '20'},
    {label: '550 Credits/$50', value: '50'},
    {label: '1200 Credits/$100', value: '100'},
];

export const Amount = (props) => {
    return <div className='amount-box' data-error={props.error}>
        {OPTIONS.map((item, idx) => {
            return <div key={idx} 
                className='amount-item'
                onClick={() => { props.onClick(item.value) }}
                data-actived={item.value === props.value}
            >
                {item.label}
            </div>
        })}
    </div>
};