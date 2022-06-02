import {message, Layout, Descriptions, Menu} from 'antd';
import React, {useState} from "react";

import {AppContext} from '../AppContext'
import { FileOutlined } from '@ant-design/icons';
import {DetectWallets} from "./DetectWallets";
import "./index.css"
import {ProviderNames} from "../../../src/types";
import * as walletSDK from '../../../index'
import {WalletFunc} from "./WalletFunc";


const {Header, Content, Footer, Sider} = Layout;

export function MainLayout() {
    const [wallet, setWallet] = useState({});
    const [collapsed, setCollapsed] = useState(false);
    const [walletList, setWalletList] = useState([]);
    const onCollapse = (value) => {
        setCollapsed(value);
    };

    const selectWallet = async (obj) => {
        setWalletList([]);
        if (obj.key == 'DetectWallets') {
            setWallet({})
            const wallets = walletSDK.detectWallets()
            const walletList = Object.values(wallets)
            setWalletList(walletList);
            return
        }
        const wallet = new walletSDK.Web3Wallets(obj.key)
        if (obj.key == ProviderNames.Metamask) {
            const accounts = await wallet.walletProvider.enable() // enable ethereum
            setWallet(wallet)
        }
        if (obj.key == ProviderNames.WalletConnect) {
            const connector = wallet.walletProvider.getConnector()
            if (connector.connected) {
                setWallet(wallet)
            } else {
                connector.on('connect', async (error, payload) => {
                    if (error) {
                        throw error
                    }
                    setWallet(wallet)
                })
            }
            connector.on('disconnect', async (error) => {
                debugger
                if (error) {
                    throw error
                }
                setWallet({})
            })
        }

        if (obj.key == ProviderNames.Coinbase) {
            const accounts = await wallet.walletProvider.enable() // enable ethereum
            setWallet(wallet)
        }

    };
    console.log('MainLayout', wallet)
    const SupportWallet = ["DetectWallets", ProviderNames.Metamask, ProviderNames.WalletConnect, ProviderNames.Coinbase]
    return (
        <AppContext.Provider value={[wallet, setWallet]}>
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo">Web3 Wallets</div>
                    <Menu theme="dark" defaultSelectedKeys={['DetectWallets']} mode="inline"
                          onClick={selectWallet}>
                        {
                            SupportWallet.map(val => (
                                <Menu.Item key={val} icon={<FileOutlined/>}>
                                    {val}
                                </Menu.Item>
                            ))
                        }

                    </Menu>
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
                    {walletList.length > 0 ? <DetectWallets walletList={walletList}/> : <WalletFunc wallet={wallet}/>}
                </Layout>
            </Layout>
        </AppContext.Provider>
    )
}



