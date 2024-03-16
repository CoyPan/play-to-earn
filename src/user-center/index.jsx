/**
 * @file 网赚首页
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/header';
import { UserProfile } from './components/user-profile';
import { BtnList } from './components/btn-list';
import { Roulette } from './components/Roulette/index';
import { CreditsPopup } from './components/credits-popup';
import { DailyTask } from './components/daily-task';
import { useLoading } from './components/use-loading-hook';
import { useToast } from './components/use-toast-hook';
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
    const [isShowRoulette, setIsShowRoulette] = useState(false);
    const [earnPopup, setEarnPopup] = useState({ isShow: false, credits: 1.4 });
    const [dailyTask, setDailyTask] = useState({ isShow: false, curIdx: 0 });
    const { showLoading, stopLoading } = useLoading();
    const { showToast } = useToast();
    const statusCallback = useRef([]);

    // 点击观看视频获取积分的按钮
    const onGetCreditBtnClick = (cb) => {
        showLoading();
        openAd(cb);
    };

    const onAdStatusChange = (status) => {
        console.log('[onAdStatusChange]', status, statusCallback.current);
        stopLoading();
        if (status !== 'sys-closing') {
            statusCallback.current.push(status);
            return;
        }
        if (status === 'sys-closing') {
            const lastStatus = statusCallback.current.pop();
            if (lastStatus === 'ad-watched') {
                // @TODO: 视频观看完成后，增加积分
                return setEarnPopup({ isShow: true, credits: 1.5 });
            }
        }
        showToast(lang('ad.error'));
    };

    const handleRouletteEnd = () => {
        console.log('[RouletteEnd]');
        // @TODO: 加积分
        setTimeout(() => {
            setIsShowRoulette(false);
        }, 4000);
    };

    // @TODO: 点击每日积分按钮，直接弹出日常任务.
    const onDailyCreditBtnClick = () => {
        setDailyTask({
            isShow: true,
            curIdx: 6,
        });
    };

    // 点击邀请按钮
    // @TODO
    const onInviteBtnClick = () => {
        // const url = `<i>Hello World</i>`
        // console.log('[click invite btn click]');
        // window.location.href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('share_test')}`;
        setEarnPopup({ isShow: true, credits: 1.5 })
    };

    // 关闭credit弹窗
    const onCloseCreditClick = () => {
        setEarnPopup(res => {
            return {
                ...res,
                isShow: false
            };
        });
    };

    // TODO: 关闭每日提任务弹窗。
    const onDailyTaskClose = () => {
        setDailyTask(res => {
            return {
                ...res,
                isShow: false,
            };
        });
    };

    return <div className='app-box wrap'>
        <Header />
        <UserProfile avatar={webAppUser?.photo_url} name={webAppUser?.username}></UserProfile>
        <div className='get-credit-btn' onClick={onDailyCreditBtnClick}>{lang('btn.daily')}</div>
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
        {
            earnPopup.isShow === true && <CreditsPopup credits={earnPopup.credits}
                onClose={onCloseCreditClick}></CreditsPopup>
        }
        {
            dailyTask.isShow === true
            && <DailyTask curIdx={dailyTask.curIdx} onClose={onDailyTaskClose}></DailyTask>
        }
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

