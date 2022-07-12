import {message, Layout, Descriptions, Menu} from 'antd';
import React, {useContext, useState} from "react";
import "../css/index.css"
import {Context} from '../AppContext'
import {DetectWallets} from "./DetectWallets";
import * as walletSDK from 'web3-wallets'
// import {WalletFunc} from "./WalletFunc";


const {Header, Content, Footer, Sider} = Layout;

export function MainLayout() {
    const {wallet, setWallet} = useContext(Context);
    const [collapsed, setCollapsed] = useState(false);
    const [walletList, setWalletList] = useState([]);
    const onCollapse = (value) => {
        setCollapsed(value);
    };

    const selectWallet = async (obj) => {
        setWalletList([]);
        debugger
        if (obj.key == 'DetectWallets') {
            setWallet({})
            const wallets = walletSDK.detectWallets()
            const walletList = Object.values(wallets)
            setWalletList(walletList);
            return
        }
        const wallet = new walletSDK.Web3Wallets({name: obj.key})
        if (obj.key == 'metamask') {
            const accounts = await wallet.walletProvider.enable() // enable ethereum
            setWallet(wallet)
        }
        if (obj.key == "wallet_connect") {
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

        if (obj.key == 'coinbase') {
            const accounts = await wallet.walletProvider.enable() // enable ethereum
            setWallet(wallet)
        }
    };
    console.log('MainLayout', wallet)
    const SupportWallet = ["DetectWallets", 'metamask', 'wallet_connect', 'coinbase']
    return (
        // <AppContext.Provider value={[wallet, setWallet]}>
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo"></div>
                    <Menu theme="dark"
                          defaultSelectedKeys={['DetectWallets']}
                          onClick={selectWallet}>
                        {
                            SupportWallet.map(val => (
                                <Menu.Item key={val} >
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
                   <DetectWallets />
                    {/*{walletList.length > 0 && <WalletFunc wallet={wallet}/>}*/}
                </Layout>
            </Layout>
        // </AppContext.Provider>
    )
}



