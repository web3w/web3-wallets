import React, {useContext, useState} from "react";
import {Button, Divider, List, Space} from "antd";
import {Context} from "../AppContext";
import Avatar from "antd/es/avatar/avatar";
// import QRCodeModal from "web3-qrcode-modal";
import QRCodeModal from '@walletconnect/qrcode-modal'
import {Web3Wallets} from 'web3-wallets';

import {iconWalletConnect, iconMetaMask, iconCoinBase, iconOneKey, iconBitKeep,iconOnto} from "../js/config"

import {walletAction} from "../js/walletAction";

const RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', //
    137: 'https://rpc-mainnet.maticvigil.com', //
    80001: 'https://rpc-mumbai.matic.today'
}

export function WalletList() {
    const {wallet, setWallet, setAccounts, setChainId} = useContext(Context);

    const selectWallet = async (item, action) => {
        // debugger
        if (wallet && wallet.walletName == item.key) {
            // setWallet(wallet)
            await walletAction(wallet, action)
            return
        }
        const newWallet = new Web3Wallets({name: item.key, qrcodeModal: QRCodeModal}, RPC_URLS)

        newWallet.on('connect', async (error, payload) => {
            if (error) {
                throw error
            }
            const {} = payload
            console.log('wallet_connect connect', payload)
            setWallet(newWallet)
        })
        newWallet.on('disconnect', async (error) => {
            if (error) {
                throw error
            }
            console.log(newWallet.walletName, 'disconnect')
            setWallet({})
        })
        newWallet.on('chainChanged', async (chainId) => {
            console.log(newWallet.walletName, 'chainChanged Page', chainId)
            setChainId(chainId)
            console.log(newWallet.walletName, "provider", newWallet.chainId, newWallet.chainId)
            setWallet(newWallet)
        })
        newWallet.on('accountsChanged', async (accounts) => {
            console.log(newWallet.walletName, 'accountsChanged Page', accounts)
            setAccounts(accounts)
            setWallet(newWallet)
        })

        newWallet.on('message', async (accounts) => {
            console.log(newWallet.walletName, 'accountsChanged Page', accounts)

        })

        const isConnect = newWallet.connected()
        if (isConnect) {
            debugger
            setWallet(newWallet)
        } else {
            await newWallet.connect().catch(e => {
                console.log(e)
            })
        }

        if (newWallet.chainId) {
            await walletAction(newWallet, action)
        }

    };


    const walletItems = [
        {title: 'MetaMask', key: 'metamask', icon: iconMetaMask, desc: "Popular wallet"},
        {title: 'WalletConnect', key: 'wallet_connect', icon: iconWalletConnect, desc: "mobile only"},
        {title: 'CoinBase', key: 'coinbase', icon: iconCoinBase, desc: "coinbase wallet"},
        {title: 'BitKeep', key: 'bitkeep', icon: iconBitKeep, desc: "BitKeep wallet"},
        {title: 'OneKey', key: 'onekey', icon: iconOneKey, desc: "One Key wallet"},
        {title: 'ONTO', key: 'onto_wallet', icon: iconOnto, desc: "ONTO wallet"}
    ];

    const accountFun = [
        {title: 'SignMessage', key: 'SignMessage', disabled: ['']},
        {title: 'SignTypedData', key: 'SignTypedData', disabled: ['onto_wallet']},
        {title: 'SignTypedDataList', key: 'SignTypedDataList', disabled: ['onto_wallet']},
        {title: 'GetBalance', key: 'GetBalance', disabled: ['']}
    ];

    const contractFun = [
        {title: 'DepositWETH', key: 'wethDeposit', disabled: ['onto_wallet']},
        {title: 'WithdrawWETH', key: 'wethWithdraw', disabled: ['onto_wallet']},
        // {title: 'Transfer', key: 'transfer', disabled: ['']},
    ]

    const walletFun = [
        {title: 'Connect', key: 'Connect', disabled: ['']},
        {title: 'DisConnect', key: 'DisConnect', disabled: ['metamask', "one_key","onto_wallet"]},
        {title: 'AddChain', key: 'AddChain', disabled: ['wallet_connect']},
        {title: 'AddToken', key: 'AddToken', disabled: ['wallet_connect', 'coinbase']},
        {title: 'SwitchChain', key: 'SwitchChain', disabled: ['wallet_connect','onto_wallet']}
    ]

    const accountActions = (item) => accountFun.map(val => {
        return <Button disabled={val.disabled.some(key => key == item.key)} key={val.title}
                       onClick={() => selectWallet(item, val.key)}>{val.title}</Button>
    })

    const contractActions = (item) => contractFun.map(val => {
        return <Button disabled={val.disabled.some(key => key == item.key)} key={val.title}
                       onClick={() => selectWallet(item, val.key)}>{val.title}</Button>
    })

    const walletActions = (item) => walletFun.map(val => {
        return <Button disabled={val.disabled.some(key => key == item.key)} key={val.title}
                       onClick={() => selectWallet(item, val.key)}>{val.title}</Button>
    })

    return (
        <>
            <List
                style={{padding: '20px 60px'}}
                itemLayout="vertical"
                size="large"
                dataSource={walletItems}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.icon} shape={'square'} size={60}/>}
                            title={<a>{item.title}</a>}
                            description={item.desc}
                        />
                        {/*{"ddddd"}*/}
                        <Space>
                            Account Actions {accountActions(item)}
                        </Space>
                        <Divider style={{margin: 8}}/>
                        <Space>
                            Contract Actions {contractActions(item)}
                        </Space>
                        <Divider style={{margin: 8}}/>
                        <Space>
                            Wallet Actions {walletActions(item)}
                        </Space>


                        {/*{()=>actions(item)}*/}
                    </List.Item>
                )}
            />
        </>
    )
}
