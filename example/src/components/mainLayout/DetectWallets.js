import {Button, Col, Row, Divider, List, message, Radio, Space, Card} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import {detectWallets, getWalletInfo} from 'web3-wallets';

// import {
//     WalletConnectClient,
//     QRCodeModal,
//     IConnector,
//     IWalletConnectSession,
//     WalletConnectProvider
// } from "web3-signer-provider";

// import {QRCodeModal} from "web3-signer-provider"


export function DetectWallets(props) {
    const {setWallet} = useContext(Context);
    const [wallets, setWallets] = useState([])
    
    const getWallet = async (action) => {
        const wallet = await getWalletInfo()
        alert(wallet.address)
    }
    useEffect(() => {
        // message.success("DetectWallets Init");
        const {metamask, coinbase, walletconnect} = detectWallets()
        setWallets([metamask, coinbase, walletconnect])
    }, []);

    const openQR = async () => {
        // QRModal.open("ssssss")
        // QRCodeModal.open("OOOO")
    }

    return (
        <>
            {wallets.length > 0 && <Row>
                <Col span={12} offset={6}>
                    {
                        wallets.map(item => (
                            <Button style={{margin: 10}} onClick={() => setWallet(item)}>{item.walletName}</Button>))
                    }
                </Col>
            </Row>
            }

            {/*<Space  size="large" align="center">*/}
            {/*    /!*<Radio.Group value={wallet} onChange={handleSizeChange}>*!/*/}
            {/*    /!*    {*!/*/}
            {/*    /!*        walletList && (walletList.map((item) => (*!/*/}
            {/*    /!*            <Radio.Button key={item.walletName} value={item}>{item.walletName}</Radio.Button>*!/*/}
            {/*    /!*        )))*!/*/}
            {/*    /!*    }*!/*/}
            {/*    /!*</Radio.Group>*!/*/}


            {/*</Space>*/}
            {/*<Space>*/}
            {/*    <Divider>Test</Divider> */}
            {/*    <Button type="primary" onClick={() => getWallet()}>GetWalletInfo</Button>*/}
            {/*    <Button type="primary" onClick={() => openQR()}>Open</Button>*/}
            {/*</Space>*/}

        </>)
}



