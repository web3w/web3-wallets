import React, {useState} from 'react';
// import {Buffer} from "buffer";
import "antd/dist/antd.css";
import {createRoot} from 'react-dom/client';
import {MainLayout} from './components/index'
import {AppContext} from "./components/AppContext";

// window.Buffer = Buffer;
const rootDiv = document.getElementById('root');
const root = createRoot(rootDiv);
// 装载
root.render(
    <AppContext>
        <MainLayout/>
    </AppContext>
);
