'use strict';
import React from 'react';
import iconMetamask from '../images/metamask.png'
import './index.scss';

export class WalletList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {age: 0}
        this.incrementAge = this.incrementAge.bind(this)
    }

    incrementAge() {
        this.setState({
            age: this.state.age + 1
        });
    }

    metaMaskHandle() {
        console.log("walletName")
    }

    render() {
        const walletList = [
            {
                name: 'Metamask',
                icon: iconMetamask,
                onClick: WalletList.metaMaskHandle
            },
            {
                name: 'Coinbase',
                icon: iconMetamask,
                onClick: WalletList.metaMaskHandle
            }
        ]
        return (
            <>
                <div className="element-connection-wallet">
                    <div className="element-connection-wallet-content">
                        {/*<h3>{t('wallet_connect_title')}</h3>*/}
                        <div className="wallet-wrapper">
                            {walletList.map(
                                (item) => (
                                    <div key={item.name} className="wallet-button-item" onClick={item.onClick}>
                                        <span>{item.name}</span>
                                        <img src={item.icon} alt={item.name}/>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

