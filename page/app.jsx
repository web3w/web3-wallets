import React, {useState} from 'react';
import "antd/dist/antd.css";
import {createRoot} from 'react-dom/client';
import {MainLayout} from './components/index'
import {ConfigProvider} from 'antd';

const root = createRoot(document.getElementById('root'));

// 装载
root.render(
    <ConfigProvider>
        <MainLayout/>
    </ConfigProvider>
);
// // 卸载
// root.unmount();
