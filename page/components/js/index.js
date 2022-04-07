import {bridge, RPC_PROVIDER, msg712sign} from './config.js'

export {bridge, RPC_PROVIDER}

async function init(chainId, address, walletName) {
    getById('accountAddr').innerText = address
    getById('chainId').innerText = chainId
    getById('walletName').innerText = walletName
}

const getById = (id) => {
    return document.getElementById(id)
}
export const signMessage = async (walletSigner) => {
    const msg = prompt("sign Info")
    const signature = await walletSigner.signMessage(msg).catch((e) => {
        throw e
    })
    alert(signature)
}

export const signTypedData = async (walletSigner) => {
    msg712sign.domain.chainId = await walletSigner.getChainId()
    const signature = await walletSigner._signTypedData(msg712sign.domain, {
        Person: msg712sign.types.Person,
        Mail: msg712sign.types.Mail
    }, msg712sign.message).catch((e) => {
        // this.emit('Error', e)
        throw e
    })
    alert(signature)
}

// const setWindows = (wallet) => {
//     window.walletProvider = wallet.walletProvider
//     window.walletSigner = wallet.walletSigner
//
//     const {address, chainId, walletName, peerMetaName} = wallet.walletProvider
//     const newName = peerMetaName ? walletName + "-" + peerMetaName : walletName
//
//     init(chainId, address, newName)
//     return {address, chainId, walletName, peerMetaName}
// }

// const detectWalletsBtn = getById('detectWalletsBtn')
// detectWalletsBtn.onclick = () => {
//     const {metamask, coinbase, walletconnect} = web3Wallet.detectWallets()
//     window.walletchange = (val) => {
//         getById('metamaskFunc').style.display = "none"
//         getById('coinbaseFunc').style.display = "none"
//         getById('walletconnectFunc').style.display = "none"
//         if (val.id == "metamask") {
//             getById('metamaskFunc').style.display = ""
//             getById('metamaskBtn').onclick = async () => {
//                 const accounts = await metamask.walletProvider.enable() // enable ethereum
//                 setWindows(metamask)
//             }
//             getById('switchBSCTESTBtn').onclick = () => {
//                 metamask.walletProvider.switchBSCTEST()
//             }
//             getById('switchRinkebyBtn').onclick = () => {
//                 metamask.walletProvider.switchRinkeby()
//             }
//
//         }
//         if (val.id == "walletconnect") {
//             getById('walletconnectFunc').style.display = ""
//             getById('walletConnectBtn').onclick = () => {
//                 const connector = walletconnect.walletProvider.getConnector()
//                 if (connector.connected) {
//                     setWindows(walletconnect)
//                 } else {
//                     connector.on('connect', async (error, payload) => {
//                         if (error) {
//                             throw error
//                         }
//                         setWindows(walletconnect)
//                     })
//                 }
//                 connector.on('disconnect', async (error) => {
//                     debugger
//                     if (error) {
//                         throw error
//                     }
//                     init(0, '', '')
//                 })
//             }
//
//         }
//
//         if (val.id == "coinbase") {
//             getById('coinbaseFunc').style.display = ""
//             getById('coinbaseWalletBtn').onclick = async () => {
//                 const accounts = await coinbase.walletProvider.enable() // enable ethereum
//                 setWindows(coinbase)
//
//                 const balance = await coinbase.walletSigner.getBalance()
//                 alert(balance)
//             }
//
//         }
//
//     };
//     let radioBtn = `
//         <input type = "radio" onchange="walletchange(this)" name="wallets" id = "walletconnect" ><label  htmlFor = "walletconnect">WalletConnect </label>
//         <input type = "radio" onchange="walletchange(this)" name="wallets"  id = "coinbase"><label  htmlFor = "coinbase">Coinbase</label>
//         `
//     if (metamask) {
//         radioBtn += `<input type = "radio" onchange="walletchange(this)" name="wallets"  id = "metamask"><label  htmlFor = "metamask"> MetaMask</label>`
//     }
//     getById('walletList').innerHTML = radioBtn
//
// }
//
// getById('metamaskWalletLinkBtn').onclick = () => {
//     const metamask = new Web3Wallets(ProviderNames.Metamask)
//     setWindows(metamask)
//     // const balance = await coinbase.walletSigner.getBalance()
//
//
// }
// getById('walletconnectWalletLinkBtn').onclick = () => {
//     const walletconnect = new Web3Wallets(ProviderNames.WalletConnect)
//     const connector = walletconnect.walletProvider.getConnector()
//     if (connector.connected) {
//         setWindows(walletconnect)
//     } else {
//         connector.on('connect', async (error, payload) => {
//             if (error) {
//                 throw error
//             }
//             setWindows(walletconnect)
//         })
//     }
//     connector.on('disconnect', async (error) => {
//         debugger
//         if (error) {
//             throw error
//         }
//         init(0, '', '')
//     })
// }
// getById('coinbaseLinkBtn').onclick = () => {
//     const coinbase = new Web3Wallets(ProviderNames.Coinbase)
//     window.walletProvider = coinbase.walletProvider
//     window.walletSigner = coinbase.walletSigner
//     const {address, chainId, walletName} = window.walletProvider
//     init(chainId, address, walletName)
// }
//
// getById('getFeeBtn').onclick = async () => {
//     const {address, chainId} = window.walletProvider
//     const fee = await get1559Fee(RPC_PROVIDER[chainId])
//     console.log(fee)
// }
// getById('getProviderBtn').onclick = async () => {
//     // const chainId = window.ethereum.networkVersion
//     // const address = window.ethereum.selectedAddress
//     const {address, chainId} = window.walletProvider
//     const {walletSigner} = getProvider({address, chainId})
//     const addr = await walletSigner.getAddress()
//     alert(addr)
// }
//
// getById('signMessageBtn').onclick = async () => {
//     signMessage(window.walletSigner)
// }
// getById('signTypeDataBtn').onclick = async () => {
//     signTypedData(window.walletSigner)
// }


