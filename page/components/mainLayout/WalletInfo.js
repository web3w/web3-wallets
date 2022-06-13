import React from "react";
import {CommonFuncBtn} from "./CommonFunc";
import {Breadcrumb, Layout} from "antd";

const {Content} = Layout

export function ContentInfo(props) {
    const {wallet} = props;
    return (<Content style={{margin: '0 16px'}}>
        {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
        {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
        {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
        {/*</Breadcrumb>*/}
        <div style={{padding: 24, minHeight: 360}}>
            {wallet.walletName && < CommonFuncBtn/>}
            {wallet.walletName == "metamask" && <div>MetaMask</div>}
            {wallet.walletName == "wallet_connect" && <div>WalletConnect</div>}
            {wallet.walletName == "coinbase" && <div>Coinbase</div>}
        </div>
    </Content>)
}
