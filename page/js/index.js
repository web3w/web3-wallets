import {bridge, RPC_PROVIDER, msg712sign} from './config.js'

async function init(chainId, address, walletName) {
    document.getElementById('accountAddr').innerText = address
    document.getElementById('chainId').innerText = chainId
    document.getElementById('walletName').innerText = walletName

    const authToken = localStorage.getItem('authToken')

    console.log('authToken', authToken)
    // orderApi = new ElementOrdersV2({chainId, address}, {authToken})
    // orderApi.on('Error', function (e) {
    //     debugger
    //     console.log('Error', e)
    // })

    // window.orderApi = orderApi


    // const unitPrice = document.getElementById('erc1155UnitPrice').value
    // const tokenAmount = document.getElementById('erc1155Amount').value
    //
    // const startAmount = document.getElementById('erc1155Price')
    // startAmount.value = unitPrice * tokenAmount


}

const getById = (id) => {
    return document.getElementById(id)
}
const signMessage = async (walletSigner) => {
    const msg = prompt("sign Info")
    const signature = await walletSigner.signMessage(msg).catch((e) => {
        throw e
    })
    alert(signature)
}

const signTypedData = async (walletSigner) => {
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

const detectWalletsBtn = getById('detectWalletsBtn')
detectWalletsBtn.onclick = () => {
    const {metamask, coinbase, walletconnect} = detectWallets()
    window.walletchange = (val) => {
        getById('metamaskFunc').style.display = "none"
        getById('coinbaseFunc').style.display = "none"
        getById('walletconnectFunc').style.display = "none"
        if (val.id == "metamask") {
            getById('metamaskFunc').style.display = ""
            getById('metamaskBtn').onclick = async () => {
                const accounts = await metamask.walletProvider.enable() // enable ethereum
                const {address, chainId, walletName} = metamask.walletProvider
                init(chainId, address, walletName)
            }
            getById('switchBSCTESTBtn').onclick = () => {
                metamask.walletProvider.switchBSCTEST()
            }
            getById('switchRinkebyBtn').onclick = () => {
                metamask.walletProvider.switchRinkeby()
            }
            getById('metamaskSignMessage').onclick = () => {
                signMessage(metamask.walletSigner)
            }

            getById('metamaskSign712').onclick = () => {
                signTypedData(metamask.walletSigner)
            }

        }
        if (val.id == "walletconnect") {
            getById('walletconnectFunc').style.display = ""
            getById('walletConnectBtn').onclick = () => {
                const connector = walletconnect.walletProvider.getConnector()
                if (connector.connected) {
                    const {address, chainId, walletName} = walletconnect.walletProvider
                    init(chainId, address, walletName)
                } else {
                    connector.on('connect', async (error, payload) => {
                        debugger
                        if (error) {
                            throw error
                        }
                        const {accounts, chainId, peerMeta} = payload.params[0]
                        init(chainId, accounts[0], peerMeta.name)
                    })
                }
                connector.on('disconnect', async (error) => {
                    debugger
                    if (error) {
                        throw error
                    }
                    init(0, '', '')
                })
            }
            getById('walletConnectSignMessage').onclick = async () => {
                const msg = prompt("sign Info")
                const signature = await walletconnect.walletSigner.signMessage(msg).catch((e) => {
                    throw e
                })
                alert(signature)
            }
            getById('walletConnectSign712').onclick = async () => {
                // const {address, chainId, walletName} = metamask.walletProvider
                // msg712sign.domain.chainId = chainId
                const signature = await walletconnect.walletSigner._signTypedData(msg712sign.domain, {
                    Person: msg712sign.types.Person,
                    Mail: msg712sign.types.Mail
                }, msg712sign.message).catch((e) => {
                    // this.emit('Error', e)
                    throw e
                })
                alert(signature)
            }
        }

        if (val.id == "coinbase") {
            getById('coinbaseFunc').style.display = ""
            getById('coinbaseWalletBtn').onclick = async () => {
                const accounts = await coinbase.walletProvider.enable() // enable ethereum
                const {address, chainId, walletName} = coinbase.walletProvider
                init(chainId, address, walletName)
            }

            getById('coinbaseSignMessage').onclick = () => {
                signMessage(coinbase.walletSigner)
            }

            getById('coinbaseSign712').onclick = () => {
                signTypedData(coinbase.walletSigner)
            }
        }

    };
    let radioBtn = ` 
        <input type = "radio" onchange="walletchange(this)" name="wallets" id = "walletconnect" ><label  htmlFor = "walletconnect">WalletConnect </label>
        <input type = "radio" onchange="walletchange(this)" name="wallets"  id = "coinbase"><label  htmlFor = "coinbase">Coinbase</label>
        `
    if (metamask) {
        radioBtn += `<input type = "radio" onchange="walletchange(this)" name="wallets"  id = "metamask"><label  htmlFor = "metamask"> MetaMask</label>`
    }
    getById('walletList').innerHTML = radioBtn

}


const feeBtn = getById('getFeeBtn')
feeBtn.onclick = async () => {
    const fee = await get1559Fee(RPC_PROVIDER[WalletProvider.chainId])
    console.log(fee)
}
const getProviderBtn = getById('getProviderBtn')
getProviderBtn.onclick = async () => {
    const chainId = window.ethereum.networkVersion
    const address = window.ethereum.selectedAddress
    const {walletSigner} = getProvider({address, chainId: 1})
    const addr = await walletSigner.getAddress()
    alert(addr)
}


