import React, {createContext, useEffect, useState} from "react";
import {Web3Wallets} from "web3-wallets";

export const Context = createContext();
export const AppContext = ({children}) => {
    const [wallet, setWallet] = useState({});
    useEffect(() => {
        // setLoading(true);
        const wallet = new Web3Wallets('metamask')
        console.log("AppContext: wallet change", wallet.address, wallet.chainId)
    }, [])
    return (<Context.Provider value={{wallet, setWallet}}>
        {children}
    </Context.Provider>)
}
