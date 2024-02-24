/**
 * @file 简单的填写表单，跳转链接的逻辑
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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

