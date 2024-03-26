/**
 * @file 游戏列表
 */

import React, { useEffect, useState } from 'react';
import './index.less';

const dataJason = require('../../data.json');

export const GameList = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
       setList(Object.keys(dataJason).map( v => ({ ...dataJason[v] })));
    }, []);

    console.log(list);
    return <div className='game-list-box'>
        {list.map(v => {
            return <a className='game-item-container' href={v.dir} key={v.dir}>
                <div className="game-item-bg" style={{ backgroundImage: `url("${v.icon}")`}}></div>
                <p>{v.name}</p>
            </a>
        })}
    </div>
};
