import React, {createContext, useEffect, useState} from "react";
import {getWalletName, Web3Wallets} from 'web3-wallets'


export const Context = createContext();
export const AppContext = ({children}) => {
    const [wallet, setWallet] = useState({});
    const [chainId, setChainId] = useState(0);
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        // setLoading(true);
        console.log("Context Wallet", window.ethereum)
        const getConnectWallet = async () => {

            const {isMobile, walletName} = getWalletName()

            if (isMobile) {
                // console.log('Coinbase', isMobile, walletName)
                const wallet = new Web3Wallets({name: walletName})
                const accounts = await wallet.connect()
                console.log('Coinbase', isMobile, walletName,accounts)
                setWallet(wallet)
            }
        }

        getConnectWallet()

        // const wallet = new Web3Wallets('metamask')
        // console.log("AppContext: wallet change", wallet.address, wallet.chainId)
    }, [wallet])
    return (<Context.Provider value={{wallet, setWallet, chainId, setChainId, accounts, setAccounts}}>
        {children}
    </Context.Provider>)
}
