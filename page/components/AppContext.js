import React, {createContext, useEffect} from "react";

export const AppContext = React.createContext();
import {Web3Wallets} from "../../src/index";

// const wallet = new Web3Wallets('metamask')
// export const Context = createContext({wallet});
// export const AppContext = ({children}) => {
//     useEffect(() => {
//         // setLoading(true);
//         console.log("AppContext: wallet change")
//     }, [wallet])
//     return (<Context.Provider value={{wallet, sdk}}>
//         {children}
//     </Context.Provider>)
// }
