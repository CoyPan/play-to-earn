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
import { NEW_USER_TASK } from './const';
import { getUserInfoById, setUserCreditsById } from './net-work';
import { queryObject } from './utils';
import { lang } from './language';
import { isPC, getUserId, openAd } from './utils';
import './index.less';

const tele = window.Telegram?.WebApp ?? {};
const webAppUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
const webAppChat = tele.initDataUnsafe?.chat;
const initData = tele.initData;
const userId = queryObject['uid'];
const rouletteAwardIdx = 0; // 轮盘默认的奖励
const adVideoAward = 0.2;

console.log('[tele]', tele);
console.log('[WebAppUser]', webAppUser);
console.log('[WebAppChat]', webAppChat);
console.log('[uid]', userId);

const App = () => {
    const [isShowRoulette, setIsShowRoulette] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [earnPopup, setEarnPopup] = useState({ isShow: false, credits: 0 });
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
                return setEarnPopup({ isShow: true, credits: adVideoAward });
            }
        }
        showToast(lang('ad.error'));
    };

    // 轮盘结束
    const handleRouletteEnd = () => {
        console.log('[RouletteEnd]');
        setUserCreditsById(userId, parseFloat(NEW_USER_TASK[rouletteAwardIdx]))
            .then(() => {
                initUserInfo();
            }).then(() => {
                setIsShowRoulette(false);
            });
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
        // setEarnPopup({ isShow: true, credits: 1.5 })
        TelegramGameProxy.shareScore();
    };

    // 关闭获取credit的弹窗
    const onCloseCreditClick = () => {
        setEarnPopup(res => {
            return {
                ...res,
                isShow: false
            };
        });
        setUserCreditsById(userId, adVideoAward)
            .then(() => {
                initUserInfo();
            })
    };

    // 关闭每日提任务弹窗。
    const onDailyTaskClose = (credits) => {
        console.log('[daily credits]', credits);
        setUserCreditsById(userId, credits)
            .then(() => {
                setDailyTask(res => {
                    return {
                        ...res,
                        isShow: false,
                    };
                });
            }).then(() => {
                initUserInfo();
            });
    };

    const initUserInfo = () => {
        return getUserInfoById(userId).then(res => {
            console.log('[res]', res);
            if (res === false) {
                return showToast(lang('network.get_user_info_error'));
            }
            setUserInfo(userInfo => ({
                ...userInfo,
                credits: res.points,
            }));
            return res.is_new;
        });
    };

    // 如果是新用户，则展示抽奖轮盘
    useEffect(() => {
        initUserInfo().then(isNewUser => {
            if(isNewUser) {
                setIsShowRoulette(true);
            }
        });
    }, []);

    return <div className='app-box wrap'>
        <Header />
        <UserProfile avatar={webAppUser?.photo_url} name={webAppUser?.username} credits={userInfo.credits}></UserProfile>
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
            awards={NEW_USER_TASK}
            awardIndex={rouletteAwardIdx}
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

