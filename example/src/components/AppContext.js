import React, {createContext, useEffect, useState} from "react";

//https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related
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
