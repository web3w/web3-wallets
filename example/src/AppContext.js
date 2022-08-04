import React, {createContext, useEffect, useState} from "react";


export const Context = createContext();
export const AppContext = ({children}) => {
    const [wallet, setWallet] = useState({});
    const [chainId, setChainId] = useState(0);
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        // setLoading(true);
        console.log("Context Wallet",wallet.chainId)
        // const wallet = new Web3Wallets('metamask')
        // console.log("AppContext: wallet change", wallet.address, wallet.chainId)
    }, [wallet])
    return (<Context.Provider value={{wallet, setWallet,chainId,setChainId,accounts,setAccounts}}>
        {children}
    </Context.Provider>)
}
