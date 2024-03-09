/**
 * @file 页面顶部的header
 */

import React from 'react';
import headerImg from '../../../../resource/img/header-box-bg.png';
import './index.less';

export const Header = () => {
    return <div className='header-box-bg' style={{ backgroundImage: `url(${headerImg})`}}></div>
};
