import {Button, Col, Divider, message, Row, Space} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import {detectWallets, getWalletInfo} from 'web3-wallets';
import QRCodeModal from "web3-qrcode-modal";
import Web3 from "web3";
import {ethers} from "ethers"


export function DetectWallets() {
    const {setWallet} = useContext(Context);
    const [wallets, setWallets] = useState([])

    const linkWallet = async (item) => {
        await item.connect()
        setWallet(item)
    }

    const web3JsWallet = async (item) => {
        const wallet = wallets[0]
        const web3 = new Web3(wallet)
        const version = web3.version
        const sign = await web3.eth.personal.sign(version, wallet.address)

        // const hex = web3.utils.keccak256(web3.utils.utf8ToHex(version))
        // debugger
        // const sign = await web3.eth.sign(hex, wallet.address)
        message.info(sign)
    }
    const ethersWallet = async (item) => {
        const wallet = wallets[0]

        const provider = new ethers.providers.Web3Provider(wallet)
        const signer = provider.getSigner()
        const sign = await signer.signMessage("hello web3")
        message.info(sign)

        const addresses = await provider.send("eth_requestAccounts", []);
    }
    useEffect(() => {
        const wallet = {qrcodeModal: QRCodeModal}
        const {metamask, coinbase, walletconnect} = detectWallets(wallet)
        setWallets([metamask, coinbase, walletconnect])
    }, []);

    return (
        <>
            {wallets.length > 0 && <Row>
                <Col span={12} offset={6}>
                    {
                        wallets.map(item => (
                            <Button key={item.walletName} style={{margin: 10}}
                                    onClick={() => linkWallet(item)}>{item.walletName}</Button>))
                    }
                </Col>
            </Row>
            }


            <Space>
                <Divider>Web3Js</Divider>
                <Button type="primary" onClick={web3JsWallet}>Web3JsSign</Button>
            </Space>

            <Space>
                <Divider>Ethers</Divider>
                <Button type="primary" onClick={ethersWallet}>EthersSign</Button>
                {/*<Button type="primary" onClick={() => openQR()}>Open</Button>*/}
            </Space>

        </>)
}



