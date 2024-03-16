/**
 * @file 抽奖轮盘
 */

import React, { useEffect, useRef, useState } from 'react';
import RouletteClass from './roulette';
import * as tool from '../../utils';
import { lang } from '../../language';
import './index.less';
import bottomBg from '../../../../resource/img/roulette-bottom-bg.png';
import backgroundBg from '../../../../resource/img/roulette-background-bg.png';
import backgroundBgUp from '../../../../resource/img/roulette-bottom-bg-up.png';
import startBtn from '../../../../resource/img/roulette-btn.png';
import star1 from '../../../../resource/img/roulette-star-1.png';
import star2 from '../../../../resource/img/roulette-star-2.png';
import star3 from '../../../../resource/img/roulette-star-3.png';


export const Roulette = (props) => {
    const [isEnd, setIsEnd] = useState(false);
    const rouletteRef = useRef(null);
    const rouletteInstanceRef = useRef(null);

    // 抽奖结束
    const handleRouletteEnd = () => {
        props.onEnd?.();
        setIsEnd(true);
    };

    // 点击抽奖按钮
    const handleStartBtnClick = (e) => {
        e.stopPropagation();
        rouletteInstanceRef.current.fire();
    };

    const handleMaskClick = () => {
        props.onClose?.()
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
            resultIdx: props.awardIndex ?? 1, // 最终奖品
            onEnd: handleRouletteEnd
        });
        rouletteInstanceRef.current.drawWheel();
    }, []);

    const canvansWidth = window.innerWidth * 364 / 750;

    return <div className='roulette-mask' style={{ display: props.isShow ? 'block' : 'none' }} onClick={handleMaskClick}>
        <div className='roulette-outer' onClick={ e => { e.stopPropagation(); }}>
            <div className='roulette-text-box'>
                <div className='congratulation' style={{ opacity: isEnd ? 1 : 0 }}>{lang('routlette.done')}</div>
                <div className='hint'>{lang('routlette.hint')}</div>
            </div>
            <div className='roulette-box'>
                {
                    isEnd && <React.Fragment>
                        <div style={{ backgroundImage: `url(${star1})` }} className='roulette-star roulette-star-1'></div>
                        <div style={{ backgroundImage: `url(${star2})` }} className='roulette-star roulette-star-2'></div>
                        <div style={{ backgroundImage: `url(${star3})` }} className='roulette-star roulette-star-3'></div>
                    </React.Fragment>
                }
                <div className='canvans-box'>
                    <div className='roulette-start-btn' 
                        onClick={handleStartBtnClick} style={{ backgroundImage: `url(${startBtn})`}}></div>
                    <canvas ref={rouletteRef} width={canvansWidth} height={canvansWidth}></canvas>
                </div>
                <div className='bottom-bg' style={{ backgroundImage: `url(${bottomBg})`}}></div>
                <div className='background-bg' style={{ backgroundImage: `url(${backgroundBg})`}}></div>
                <div className='bottom-bg-up' style={{ backgroundImage: `url(${backgroundBgUp})` }}></div>
            </div>
        </div>
    </div>
};