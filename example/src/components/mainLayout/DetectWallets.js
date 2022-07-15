import {Button, Col, Row} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import {detectWallets, getWalletInfo} from 'web3-wallets';


export function DetectWallets() {
    const {setWallet} = useContext(Context);
    const [wallets, setWallets] = useState([])

    const getWallet = async (action) => {
        const wallet = await getWalletInfo()
        alert(wallet.address)
    }
    useEffect(() => {

        // if (obj.key == 'detectWallets') {
        //     setWallet({})
        //     const wallets = walletSDK.detectWallets()
        //     const walletList = Object.values(wallets)
        //     setWalletList(walletList);
        //     return
        // }

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
                            <Button key={item.walletName} style={{margin: 10}}
                                    onClick={() => setWallet(item)}>{item.walletName}</Button>))
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



