import {bridge, RPC_PROVIDER, msg712sign} from './config.js'

export {bridge, RPC_PROVIDER}




// export const providerSignTypedData = async (wallet) => {
//     const message = JSON.stringify(msg712sign);
//
//     const connector = wallet.walletProvider.connector
//     const address = await wallet.walletSigner.getAddress()
//
//     debugger
//     const msgParams = [address, message];
//     const signature = await connector.signTypedData(msgParams).catch((e) => {
//         // this.emit('Error', e)
//         throw e
//     })
//     return signature
// }

