/**
 * @file 网赚首页
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';

const App = () => {
    return <div>123</div>
};

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

