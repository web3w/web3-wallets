import React from "react";
import {CommonFuncBtn} from "./CommonFunc";
import {Breadcrumb, Button, Space, Layout} from "antd";

const {Content} = Layout

export function WalletFunc(props) {
    const {wallet} = props;
    console.log(wallet)
    return (<Content style={{margin: '0 16px'}}>
        {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
        {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
        {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
        {/*</Breadcrumb>*/}
        <div style={{padding: 24, minHeight: 360}}>
            {wallet.walletName && < CommonFuncBtn/>}
            {wallet.walletName == 'metamask'
            && <Space size={10}>
                <Button onClick={() => {
                    wallet.walletProvider.switchBSCTEST()
                }}>Switch-BSCTEST</Button>
                <Button onClick={() => {
                    wallet.walletProvider.switchRinkeby()
                }}>Switch-Rinkeby</Button>
            </Space>}
            {wallet.walletName == 'wallet-connect' && <Space size={10}>
                <Button onClick={() => {
                    wallet.walletProvider.disconnect()
                }}>Disconnect</Button>
            </Space>}
            {wallet.walletName == 'coinbase' && <div>Coinbase</div>}
        </div>
    </Content>)
}
