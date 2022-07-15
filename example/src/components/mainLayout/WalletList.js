import React, {useContext, useState} from "react";
import {Layout, List, message, notification} from "antd";
import {Context} from "../AppContext";
import Avatar from "antd/es/avatar/avatar";
import QRCodeModal from "web3-qrcode-modal";
import {ethers, Web3Wallets} from 'web3-wallets';
import {providerSignTypedData, RPC_PROVIDER, signMessage, signTypedData} from "../js";


export function WalletList() {
    const {wallet, setWallet} = useContext(Context);

    const sendWallet = async (action) => {
        if (!wallet) {
            message.error('Please select wallet');
            return
        }
        console.log(action, wallet)
        if (action == 'SignTypedData') {


            // const msg = await signTypedData(wallet.walletSigner)
            const msg = await providerSignTypedData(wallet)

            notification["info"]({
                message: 'SignMessage',
                description: msg
            });
        }

        if (action == 'SignMessage') {
            debugger
            const msg = await signMessage(wallet.walletSigner)
            notification["info"]({
                message: 'SignMessage',
                description: msg
            });
        }

        if (action == 'Get1559Fee') {
            const {walletSigner, walletProvider} = wallet
            const {chainId} = walletProvider
            console.log(await walletSigner.getBalance())
            console.log(RPC_PROVIDER[chainId])
            if (chainId.toString() == '56' || chainId.toString() == '97') {
                return
            }
            // console.log(await walletSDK.get1559Fee())
        }

        if (action == 'GetBalance') {
            const {walletSigner, walletProvider} = wallet
            const balance = await walletSigner.getBalance()
            const eth = ethers.utils.formatEther(balance)

            const msg = `Address: ${walletProvider.address}  
                       ChainId: ${walletProvider.chainId}  
                       Balance: ${eth}ETH`
            notification["info"]({
                message: `GetBalance ${wallet.walletName}`,
                description: msg
            });


        }

        if (action == 'SendContract') {
            const iface = new ethers.utils.Interface(['function migrate()']);
            const callData = iface.encodeFunctionData('migrate', []);
            console.log('callData: ', callData.toString());

            const wethAbi = [{
                "inputs": [],
                "name": "deposit",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
                {
                    "inputs": [],
                    "name": "name",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }]

            const {walletSigner, walletProvider} = wallet
            const chainId = walletProvider.chainId
            // WETH
            let wethAddress;
            if (chainId === 1) { // eth
                wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
            } else if (chainId === 4) { // rinkeby
                wethAddress = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
            } else if (chainId === 56) { // bsc
                wethAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
            } else if (chainId === 97) { // bsc_testnet
                wethAddress = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
            } else if (chainId === 137) { // polygon
                wethAddress = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';
            } else {
                throw Error("Unknow chain=" + chainId);
            }
            console.log('weth : ' + wethAddress);
            const weth = new ethers.Contract(wethAddress, wethAbi, walletSigner)
            console.log(await weth.name())

            if (walletProvider.walletName == 'wallet_connect') {
                const {walletName, peerMetaName} = walletProvider
                notification['info']({
                    message: walletName,
                    description: `Please open ${peerMetaName} App`,
                });
            }
            await weth.deposit({value: 1e12.toString()})
        }

    };

    const selectWallet = async (item, action) => {
        const wallet = new Web3Wallets({name: item.key})
        if (item.key == 'metamask') {
            const accounts = await wallet.walletProvider.enable() // enable ethereum
            setWallet(wallet)
        }
        if (item.key == "wallet_connect") {
            const connector = wallet.walletProvider.connector
            // debugger
            if (connector.connected) {
                setWallet(wallet)
            } else {
                // await wallet.walletProvider.open()
                await connector.createSession()
                debugger
                QRCodeModal.open(connector.uri, () => {
                    console.log("QRCodeModal, close")
                })
            }
            debugger
            connector.on('connect', async (error, payload) => {
                if (error) {
                    throw error
                }
                setWallet(wallet)
            })
            connector.on('disconnect', async (error) => {
                debugger
                if (error) {
                    throw error
                }
                setWallet({})
            })
        }

        if (item.key == 'coinbase') {
            const accounts = await wallet.walletProvider.enable() // enable ethereum
            setWallet(wallet)
        }

        if(wallet.walletProvider.chainId){
            sendWallet(action)
        }


        // if (action == 'GetBalance') {
        //     const {walletSigner, walletProvider} = wallet
        //     const balance = await walletSigner.getBalance()
        //     const eth = ethers.utils.formatEther(balance)
        // }
    };


    const items = [
        {title: 'MetaMask', key: 'metamask'},
        {title: 'WalletConnect', key: 'wallet_connect'},
        {title: 'CoinBase', key: 'coinbase'}
    ];

    return (
        <>
            <List
                style={{padding: '60px 150px'}}
                itemLayout="horizontal"
                dataSource={items}
                renderItem={item => (
                    <List.Item actions={[
                        <a key="getBalance" onClick={() => selectWallet(item, "GetBalance")}>Balance</a>,
                        <a key="SignMessage" onClick={() => selectWallet(item, "SignMessage")}>SignMessage</a>,
                        <a key="SignTypedData" onClick={() => selectWallet(item, "SignTypedData")}>SignTypedData</a>,
                        <a key="SendContract" onClick={() => selectWallet(item, "SendContract")}>SendContract</a>,
                        <a key="switchChain" onClick={() => selectWallet(item, "SwitchChain")}>SwitchChain</a>,

                    ]}>
                        <List.Item.Meta
                            avatar={<Avatar src="../images/walletconnect-logo.svg"/>}
                            title={<a>{item.title}</a>}
                            description="Wallet Info"
                        />
                    </List.Item>
                )}
            />


        </>

    )
}
