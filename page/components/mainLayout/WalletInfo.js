import React from "react";
import {CommonFuncBtn} from "./CommonFunc";
import {ProviderNames} from "../../../src/types";
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
            {wallet.walletName == ProviderNames.Metamask && <div>MetaMask</div>}
            {wallet.walletName == ProviderNames.WalletConnect && <div>WalletConnect</div>}
            {wallet.walletName == ProviderNames.Coinbase && <div>Coinbase</div>}
        </div>
    </Content>)
}
