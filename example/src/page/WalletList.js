import React, {useContext, useState} from "react";
import {Button, Divider, List, Space} from "antd";
import {Context} from "../AppContext";
import Avatar from "antd/es/avatar/avatar";
// import QRCodeModal from "web3-qrcode-modal";
import QRCodeModal from '@walletconnect/qrcode-modal'
import {Web3Wallets} from 'web3-wallets';

import {metamaskIcon, coinbaseIcon, walletConnectIcon} from "../js/config"

import {walletAction} from "../js/walletAction";

const RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', //
    137: 'https://rpc-mainnet.maticvigil.com', //
    80001: 'https://rpc-mumbai.matic.today'
}

export function WalletList() {
    const {wallet, setWallet} = useContext(Context);

    const selectWallet = async (item, action) => {
        // debugger
        if (wallet && wallet.walletName == item.key) {
            setWallet(wallet)
            await walletAction(wallet, action)
            return
        }
        const newWallet = new Web3Wallets({name: item.key, qrcodeModal: QRCodeModal}, RPC_URLS)

        if (item.key == 'one_key') {
            const provider = newWallet.walletProvider

            const accounts = await provider.connect() // enable ethereum
            setWallet(newWallet)
            provider.on('chainChanged', async (walletChainId) => {
                setWallet(wallet)
                console.log('one_key chainChanged Page', walletChainId)
            })

            provider.on('accountsChanged', async (accounts) => {
                setWallet(wallet)
                console.log('one_key accountsChanged Page', accounts)

            })

        }

        if (item.key == 'metamask') {
            const provider = newWallet.walletProvider
            const accounts = await provider.connect() // enable ethereum
            setWallet(newWallet)
            provider.on('chainChanged', async (walletChainId) => {
                setWallet(newWallet)
                console.log('Matemask chainChanged Page', walletChainId)
            })

            provider.on('accountsChanged', async (accounts) => {
                setWallet(newWallet)
                console.log('Matemask accountsChanged Page', accounts)

            })

        }
        if (item.key == "wallet_connect") {
            const provider = newWallet.walletProvider

            if (provider.connected) {
                setWallet(newWallet)
            } else {
                if (action != "DisConnect") {
                    await provider.open()
                }
            }
            provider.on('connect', async (error, payload) => {
                if (error) {
                    throw error
                }
                const {} = payload
                setWallet(newWallet)
            })
            provider.on('disconnect', async (error) => {
                if (error) {
                    throw error
                }
                setWallet({})
            })
        }

        if (item.key == 'coinbase') {
            const provider = newWallet.walletProvider
            const accounts = await provider.connect() // enable ethereum
            setWallet(newWallet)
            provider.on('chainChanged', async (walletChainId) => {
                setWallet(newWallet)
                console.log('Coinbase chainChanged Page', walletChainId)
            })

            provider.on('accountsChanged', async (accounts) => {
                setWallet(newWallet)
                console.log('Coinbase accountsChanged Page', accounts)

            })
        }

        if (newWallet.chainId) {
            await walletAction(newWallet, action)
        }

    };


    const walletItems = [
        {title: 'MetaMask', key: 'metamask', icon: metamaskIcon, desc: "Popular wallet"},
        {title: 'WalletConnect', key: 'wallet_connect', icon: walletConnectIcon, desc: "mobile only"},
        {title: 'CoinBase', key: 'coinbase', icon: coinbaseIcon, desc: "coinbase wallet"},
        {title: 'OneKey', key: 'one_key', icon: metamaskIcon, desc: "One Key wallet"}
    ];

    const accountFun = [
        {title: 'SignMessage', key: 'SignMessage', disabled: ['']},
        {title: 'SignTypedData', key: 'SignTypedData', disabled: ['']},
        {title: 'SignTypedDataList', key: 'SignTypedDataList', disabled: ['']},
        {title: 'GetBalance', key: 'GetBalance', disabled: ['']}
    ];

    const contractFun = [
        {title: 'DepositWETH', key: 'wethDeposit', disabled: ['']},
        {title: 'WithdrawWETH', key: 'wethWithdraw', disabled: ['']},
        // {title: 'Transfer', key: 'transfer', disabled: ['']},
    ]

    const walletFun = [
        {title: 'Connect', key: 'Connect', disabled: ['']},
        {title: 'DisConnect', key: 'DisConnect', disabled: ['metamask']},
        {title: 'AddChain', key: 'AddChain', disabled: ['wallet_connect']},
        {title: 'AddToken', key: 'AddToken', disabled: ['wallet_connect', 'coinbase']},
        {title: 'SwitchChain', key: 'SwitchChain', disabled: ['wallet_connect']}
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
