import {message, Layout, Descriptions, Menu} from 'antd';
import React, {useContext, useState} from "react";
import "../assets/css/index.css"
import {Context} from '../AppContext'
import {DetectWallets} from "./DetectWallets";
import {WalletList} from "./WalletList";
import pkg from '../../package.json'
import {ChainList} from "./ChainList";

const {Header, Content, Footer, Sider} = Layout;

export function App() {
    const {wallet} = useContext(Context);
    const [collapsed, setCollapsed] = useState(false);
    const [page, setPage] = useState("walletList");


    const items = [
        {label: 'WalletList', key: 'walletList'},
        {label: 'ChainList', key: 'chainList'},
        {label: 'DetectWallets', key: 'detectWallets'}, // 菜单项务必填写 key
    ];
    return (
        // <AppContext.Provider value={[wallet, setWallet]}>
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="logo">{`${pkg.name}@${wallet.version}`}</div>
                <Menu theme="dark"
                      defaultSelectedKeys={[page]}
                      onClick={(val) => setPage(val.key)}
                      items={items}
                />
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 10}}>
                    {wallet.walletName && <Descriptions size="small" column={2}>
                        <Descriptions.Item label="Name">{wallet.walletName}</Descriptions.Item>
                        <Descriptions.Item label="ChainId">
                            <a>{wallet.walletProvider.chainId}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">{wallet.walletProvider.address}</Descriptions.Item>
                        {wallet.walletProvider.peerMetaName &&
                        <Descriptions.Item
                            label="PeerMetaName">{wallet.walletProvider.peerMetaName}</Descriptions.Item>}
                    </Descriptions>}
                </Header>
                {page == "walletList" && <WalletList/>}
                {page == "chainList" && <ChainList/>}
                {page == "detectWallets" && <DetectWallets/>}
            </Layout>
        </Layout>
        // </AppContext.Provider>
    )
}



