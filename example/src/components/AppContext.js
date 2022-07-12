import React, {createContext, useEffect, useState} from "react";

// export const AppContext = React.createContext();
// import {Web3Wallets} from "../../../src";

// const wallet = new Web3Wallets('metamask')
export const Context = createContext();
export const AppContext = ({children}) => {
    const [wallet, setWallet] = useState({});
    useEffect(() => {
        // setLoading(true);
        console.log("AppContext: wallet change")
    }, [])
    return (<Context.Provider value={{wallet, setWallet}}>
        {children}
    </Context.Provider>)
}
