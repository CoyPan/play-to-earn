/**
 * @file 网赚首页
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/header';
import { UserProfile } from './components/user-profile';
import { BtnList } from './components/btn-list';
import { isPC, getUserId, openAd } from './utils';
import './index.less';


const tele = window.Telegram.WebApp;
const webAppUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
const webAppChat = tele.initDataUnsafe?.chat;
const initData = tele.initData;

console.log('[tele]', tele);
console.log('[WebAppUser]', webAppUser);
console.log('[WebAppChat]', webAppChat);

const App = () => {

    // 点击观看视频获取积分的按钮
    const onGetCreditBtnClick = (cb) => {
       openAd(cb);
    };

    const onAdStatusChange = (status) => {
        console.log('[onAdStatusChange]', status)
    }

    return <div className='app-box wrap'>
        <Header />
        <UserProfile avatar={webAppUser?.photo_url} name={webAppUser?.username}></UserProfile>
        <div className='get-credit-btn' onClick={() => onGetCreditBtnClick(onAdStatusChange)}>Daily Credit</div>
        <div className='main-content-box'>
            <div className='content-title'>Quick Credit</div>
            <BtnList onInvite={() => {}} onGetCredit={() => { onGetCreditBtnClick(onAdStatusChange) }}></BtnList>
            <div className='content-title'>Bots For You</div>
        </div>
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

