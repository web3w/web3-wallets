import React from 'react';
import "antd/dist/antd.css";
import {createRoot} from 'react-dom/client';
import {App} from './page/App'
import {AppContext} from "./AppContext";

const rootDiv = document.getElementById('root');
const root = createRoot(rootDiv);
root.render(
    <AppContext>
        <App/>
    </AppContext>
);
