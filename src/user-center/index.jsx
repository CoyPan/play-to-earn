/**
 * @file 网赚首页
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/header';
import { UserProfile } from './components/user-profile';
import { BtnList } from './components/btn-list';
import { Roulette } from './components/Roulette/index';
import { lang } from './language';
import { isPC, getUserId, openAd } from './utils';
import './index.less';

const tele = window.Telegram?.WebApp ?? {};
const webAppUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
const webAppChat = tele.initDataUnsafe?.chat;
const initData = tele.initData;

console.log('[tele]', tele);
console.log('[WebAppUser]', webAppUser);
console.log('[WebAppChat]', webAppChat);

const App = () => {

    const [isShowRoulette, setIsShowRoulette] = useState(true);

    // 点击观看视频获取积分的按钮
    const onGetCreditBtnClick = (cb) => {
       openAd(cb);
    };

    const onAdStatusChange = (status) => {
        console.log('[onAdStatusChange]', status)
    };

    const handleRouletteEnd = () => {
        console.log('[RouletteEnd]');
        // @TODO: 加积分
        setTimeout(() => {
            setIsShowRoulette(false);
        }, 4000);
    };

    // @TODO: 点击每日积分按钮，直接打开轮盘抽奖.
    const onDailyCreditBtnClick = () => {
        console.log('onDailyCreditBtnClick');
    };

    // 点击邀请按钮
    const onInviteBtnClick = () => {
        const url = `<i>Hello World</i>`
        console.log('[click invite btn click]');
        window.location.href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('share_test')}`;
    };

    return <div className='app-box wrap'>
        <Header />
        <UserProfile avatar={webAppUser?.photo_url} name={webAppUser?.username}></UserProfile>
        <div className='get-credit-btn' onClick={onDailyCreditBtnClick}>{lang('btn.get')}</div>
        <div className='main-content-box'>
            <div className='content-title'>{lang('section.title')}</div>
            <BtnList 
                onInvite={onInviteBtnClick}
                onGetCredit={() => { onGetCreditBtnClick(onAdStatusChange) }}
            ></BtnList>
        </div>
        <Roulette 
            isShow={isShowRoulette} 
            awards={['10 c', '20 c', '3 c', '4 c', '5 c', '6 c']} 
            awardIndex={1}
            onClose={() => { setIsShowRoulette(false); }}
            onEnd={handleRouletteEnd}
        ></Roulette>
    </div>
};








// 渲染节点
const root = ReactDOM.createRoot(document.getElementById("app"));
class Wrapper extends React.Component {
    componentDidCatch(e) {
        console.log(e);
    }
    render() {
        return <App></App>;
    }
};

root.render(<Wrapper />);

