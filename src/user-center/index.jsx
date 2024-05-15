/**
 * @file 网赚首页
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/header';
import { UserProfile } from './components/user-profile';
import { BtnList } from './components/btn-list';
import { GameList } from './components/game-list';
import { Roulette } from './components/Roulette/index';
import { CreditsPopup } from './components/credits-popup';
import { DailyTask } from './components/daily-task';
import { useLoading } from './components/use-loading-hook';
import { useToast } from './components/use-toast-hook';
import { NEW_USER_TASK, CREDIT_REASON } from './const';
import { getUserInfoById, setUserCreditsById, doDailySignIn, getCurSigninStatus, getUserProfileInfoById } from './net-work';
import { queryObject, formatImgBase64 } from './utils';
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

// 是否需要进行签到奖励
let needSignReward;

console.log('[tele]', tele);
console.log('[WebAppUser]', webAppUser);
console.log('[WebAppChat]', webAppChat);
console.log('[uid]', userId);

const App = () => {
    const [isShowRoulette, setIsShowRoulette] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [earnPopup, setEarnPopup] = useState({ isShow: false, credits: 0 });
    const [dailyTask, setDailyTask] = useState({ isShow: false, curIdx: 0 });
    const { showLoading, stopLoading, isLoading } = useLoading();
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
        setUserCreditsById(userId, parseFloat(NEW_USER_TASK[rouletteAwardIdx]), CREDIT_REASON.new_user)
            .then(() => {
                initUserInfo();
            }).then(() => {
                setIsShowRoulette(false);
            });
    };

    // 点击每日积分按钮，直接弹出日常任务.
    const onDailyCreditBtnClick = async () => {
        if(isLoading) {
            return;
        }
        showLoading();
        const signStatus = await getCurSigninStatus(userId);
        console.log('[signStatus]', signStatus);

        // 当天已经签到过
        if(signStatus.todayIsSign === true) {
            stopLoading();
            setDailyTask({
                isShow: true,
                curIdx: signStatus.dayCount - 1,
            });
            showToast(lang('daily.already'));
            return;
        }

        // 当天没有签到
        if (signStatus.todayIsSign === false) {
            needSignReward = true;
        }
        const isSignSucc = await doDailySignIn(userId);
        
        // 获取当天应该获取第几天的签到奖励
        let curIdx;
        if (signStatus.todayIsSign === false && isSignSucc) {
            curIdx = signStatus.dayCount + 1;
        } else {
            curIdx = signStatus.dayCount;
        }
        setDailyTask({
            isShow: true,
            curIdx: curIdx - 1,
        });
        stopLoading();
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
        setUserCreditsById(userId, adVideoAward, CREDIT_REASON.watch_video_ad)
            .then(() => {
                initUserInfo();
            })
    };

    // 关闭每日提任务弹窗。
    const onDailyTaskClose = (credits) => {
        if (!needSignReward) {
            return setDailyTask(res => ({
                ...res,
                isShow: false,
            }));
        } else {
            setUserCreditsById(userId, credits, CREDIT_REASON.daily_task)
                .then(() => {
                    setDailyTask(res => ({
                        ...res,
                        isShow: false,
                    }));
                }).then(() => {
                    initUserInfo();
                });
        }
    };

    const initUserInfo = () => {
        return getUserInfoById(userId).then(creditInfo => {
            if (creditInfo === false) {
                return showToast(lang('network.get_user_info_error'));
            }
            setUserInfo(userInfo => ({
                ...userInfo,
                credits: creditInfo.points,
            }));
            return creditInfo.is_new;
        })
    };

    // 初始化用户的名称、头像等
    const initUserProfileInfo = () => {
        getUserProfileInfoById(userId).then(profileInfo => {
            if (profileInfo === false) {
                return showToast(lang('network.get_user_profile_error'));
            }
            setUserInfo(userInfo => ({
                ...userInfo,
                photo_url: formatImgBase64(profileInfo.photos),
                username: profileInfo.usename,
            }));
        });
    };

   
    useEffect(() => {
        initUserProfileInfo();
        initUserInfo().then(isNewUser => {
             // 如果是新用户，则展示抽奖轮盘
            if(isNewUser) {
                setIsShowRoulette(true);
            }
        });
    }, []);

    return <div className='app-box wrap'>
        <Header />
        <UserProfile avatar={userInfo.photo_url} name={userInfo.username} credits={userInfo.credits}></UserProfile>
        {/* <div className='get-credit-btn' onClick={onDailyCreditBtnClick}>{lang('btn.daily')}</div> */}
        <div className='main-content-box'>
            <div className='content-title'>{lang('section.title')}</div>
            <BtnList
                onDailyCredit={onDailyCreditBtnClick}
                onInvite={onInviteBtnClick}
                onGetCredit={() => { onGetCreditBtnClick(onAdStatusChange) }}
            ></BtnList>
            <div className='content-title'>{lang('section.game')}</div>
            <GameList />
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

