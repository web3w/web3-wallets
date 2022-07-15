import {Button, Col, Row} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import {detectWallets, getWalletInfo} from 'web3-wallets';
import QRCodeModal from "web3-qrcode-modal";

export function DetectWallets() {
    const {setWallet} = useContext(Context);
    const [wallets, setWallets] = useState([])

    const linkWallet = async (item) => {
        debugger
        await item.enable()
        setWallet(item)
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



