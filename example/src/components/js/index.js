import {bridge, RPC_PROVIDER, msg712sign} from './config.js'

export {bridge, RPC_PROVIDER}


export const signMessage = async (walletSigner) => {
    const msg = prompt("sign Info")
    const signature = await walletSigner.signMessage(msg).catch((e) => {
        throw e
    })

    return signature
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
    return signature
}

export const providerSignTypedData = async (wallet) => {
    const message = JSON.stringify(msg712sign);

    const connector = wallet.walletProvider.connector
    const address = await wallet.walletSigner.getAddress()

    debugger
    const msgParams = [address, message];
    const signature = await connector.signTypedData(msgParams).catch((e) => {
        // this.emit('Error', e)
        throw e
    })
    return signature
}

