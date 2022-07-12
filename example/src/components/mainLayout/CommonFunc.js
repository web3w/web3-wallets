import {message} from 'antd';
import {Button, notification, Space} from "antd";
import React, {useContext} from "react";
import {signMessage, signTypedData, RPC_PROVIDER} from '../js'
import {ethers} from 'web3-wallets';
import {AppContext} from '../AppContext'

export function CommonFuncBtn() {
    const [wallet] = useContext(AppContext);
    const sendWallet = async (action) => {
        console.log("CommonFuncBtn", wallet)
        if (!wallet) {
            message.error('Please select wallet');
            return
        }
        console.log(action, wallet)
        if (action == 'SignTypedData') {
            signTypedData(wallet.walletSigner)
        }

        if (action == 'SignMessage') {
            signMessage(wallet.walletSigner)
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
            message.info(`${eth}ETH`);
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
    const CommonFunc = ['GetBalance', 'SendContract', 'SignMessage', 'SignTypedData'] //'Get1559Fee',
    return (
        <Space style={{padding: 10}}>
            {wallet && (CommonFunc.map(val => (
                <Button type="primary" key={val} onClick={() => sendWallet(val)}>{val}</Button>
            )))
            }
        </Space>
    );
}



