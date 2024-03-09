/**
 * @file 抽奖轮盘
 */

import React, { useEffect, useRef } from 'react';
import RouletteClass from './roulette';
import RoulettePng from '../../../../resource/img/roulette-words.png';
import * as tool from '../../utils';
import './index.less';

export const Roulette = (props) => {
    const rouletteRef = useRef(null);
    const rouletteInstanceRef = useRef(null);

    // 抽奖结束
    const handleRouletteEnd = () => {
        props.onEnd?.();
    };

    // 点击抽奖按钮
    const handleStartBtnClick = () => {
        rouletteInstanceRef.current.fire();
    };

    useEffect(() => {
        if(!rouletteRef.current) {
            return;
        }
        const canvas = rouletteRef.current;
        const ctx = canvas.getContext("2d");

        // 解决文字模糊的问题
        const per = tool.getPixelRatio(ctx);
        const h = canvas.height;
        const w = canvas.width;
        canvas.height = h * per;
        canvas.width = w * per;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        rouletteInstanceRef.current = new RouletteClass({
            canvas: canvas,
            ctx: ctx,
            awards: props.awards ?? ['$1', '$2', '$3', '$4', '$5', '$6'],
            resultIdx: props.awardIndex ?? 1,
            onEnd: handleRouletteEnd
        });
        rouletteInstanceRef.current.drawWheel();
    }, []);

    return <div className='roulette-mask' style={{ display: props.isShow ? 'block' : 'none' }}>
        <div className='roulette-box'>
            <img src={RoulettePng}></img>
            <div className='canvans-box'>
                <div className='roulette-start-btn' onClick={handleStartBtnClick}>Start</div>
                <canvas ref={rouletteRef} width={340} height={340}></canvas>
            </div>
        </div>
    </div>
};