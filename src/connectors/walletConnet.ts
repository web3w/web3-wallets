import WalletConnectClient from '@walletconnect/client'
import {IConnector, IWalletConnectSession} from '@walletconnect/types'
import QRCodeModal from '@walletconnect/qrcode-modal'
import WalletConnectProvider from "./provider/ethereumProvider";
import {CHAIN_ID_RPC} from "../../index"

const getWalletConnectProvider = (
    chainId: number,
    connector: IConnector
) => {
    // export const apiHostTest = 'api-test.element.market' // 测试服外网接口香港入口
    // export const apiHostTestChina = 'element-api-test.eossql.com' // 测试服外网接口大陆入口
    // export const apiHostEth = 'api.element.market' // 正式服外网接口香港入口
    // /api/v1/jsonrpc
    // /https://api-test.element.market/api/bsc/jsonrpc
    // https://data-seed-prebsc-1-s1.binance.org:8545
    debugger
    const custom: { [chainId: number]: string } = CHAIN_ID_RPC
    let provider: WalletConnectProvider
    const walletSession: string | null = localStorage.getItem('walletconnect')
    const signingMethods = ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign', 'personal_sign', 'eth_sendTransaction']
    if (walletSession) {
        // const session: IWalletConnectSession = <IWalletConnectSession>JSON.parse(walletSession)

        // const loginTime = parseInt((session.handshakeId / 1000).toString())
        // this.account = session.accounts[0]
        // this.walletName = session.peerMeta?.name || ''
        provider = new WalletConnectProvider({
            rpc: custom,
            chainId: Number(chainId),
            signingMethods,
            connector
        })
    } else {
        provider = new WalletConnectProvider({
            rpc: custom,
            chainId: Number(chainId),
            signingMethods,
            connector
        })
    }
    return provider

    // await provider.enable()


    // const web3Provider = new providers.Web3Provider(provider)
    // const provider = new EthereumProvider(accounts, { rpc: { custom }, chainId, client: { rpc: custom,connector } })
    // return provider
}

export class ConnectWallet extends WalletConnectProvider {
    // public walletName: string = ''//ProviderNames.WalletConnect
    public walletProvider: any
    // public connector: IConnector
    // public chainId: string = ''
    public account: string = ''
    // public bridge="https://element-api-test.eossql.com/bridge/walletconnect"
    // public bridge = 'https://element-api.eossql.com/bridge/walletconnect'
    public bridge = 'https://bridge.walletconnect.org'

    // Create a connector
    constructor() {
        super()
        let connector = new WalletConnectClient({
            bridge: this.bridge, // Required
            qrcodeModal: QRCodeModal
        })
        const walletStr = localStorage.getItem('walletconnect')
        debugger
        if (walletStr) {
            const wallet: IWalletConnectSession = <IWalletConnectSession>JSON.parse(walletStr)
            connector = new WalletConnectClient({session: wallet})
            this.walletProvider = getWalletConnectProvider(wallet.chainId, connector)
            this.walletProvider.enable()
        }


        console.log('connector', this.connector)
        // Check if connection is already established
        if (!connector.connected) {
            // create new session
            connector.createSession()
        }
        // Subscribe to connection events
        connector.on('connect', async (error, payload) => {
            if (error) {
                throw error
            }
            debugger
            console.log('connect 2', payload)
            // Get provided accounts and chainId
            const {accounts, chainId} = payload.params[0]
            // this.chainId = chainId
            this.account = accounts[0]
            this.walletProvider = getWalletConnectProvider(chainId, connector)
            this.walletProvider.enable()
        })

        connector.on('session_update', (error, payload) => {
            if (error) {
                throw error
            }
            console.log('session_update', payload)
            // Get updated accounts and chainId
            const {accounts, chainId} = payload.params[0]
            // this.chainId = chainId
            this.account = accounts[0]
        })

        connector.on('disconnect', (error) => {
            if (error) {
                throw error
            }
            console.log('disconnect', error)
            // this.chainId = ''
            this.account = ''
            // Delete connector
        })
    }
}

//
//   async sendTransaction(tx) {
//     this.connector.sendTransaction(tx)
//       .then((result) => {
//         // Returns transaction id (hash)
//         console.log(result)
//       })
//       .catch((error) => {
//         // Error returned when rejected
//         console.error(error)
//       })
//   }
//
//   async signTransaction(tx) {
//     this.connector.signTransaction(tx)
//       .then((result) => {
//         // Returns transaction id (hash)
//         console.log(result)
//       })
//       .catch((error) => {
//         // Error returned when rejected
//         console.error(error)
//       })
//   }
//
//   async signMessage(message: string) {
//     const msgParams = [
//       this.account                          // Required
//       // keccak256("\x19Ethereum Signed Message:\n" +  message.length + message))    // Required
//     ]
//     this.connector.signMessage(msgParams)
//       .then((result) => {
//         // Returns transaction id (hash)
//         console.log(result)
//       })
//       .catch((error) => {
//         // Error returned when rejected
//         console.error(error)
//       })
//   }
//
//   async signTypedData(typedData: any) {
//     const msgParams = [
//       this.account,                            // Required
//       typedData   // Required
//     ]
//     this.connector.signTypedData(msgParams)
//       .then((result) => {
//         // Returns transaction id (hash)
//         console.log(result)
//       })
//       .catch((error) => {
//         // Error returned when rejected
//         console.error(error)
//       })
//   }
//
//   async customRequest(typedData: any) {
//     const customRequest = {
//       id: 1337,
//       jsonrpc: '2.0',
//       method: 'eth_signTransaction',
//       params: [
//         {
//           from: this.account,
//           to: '0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359',
//           data: '0x',
//           gasPrice: '0x02540be400',
//           gas: '0x9c40',
//           value: '0x00',
//           nonce: '0x0114'
//         }
//       ]
//     }
//     this.connector.sendCustomRequest(customRequest)
//       .then((result) => {
//         // Returns transaction id (hash)
//         console.log(result)
//       })
//       .catch((error) => {
//         // Error returned when rejected
//         console.error(error)
//       })
//   }
// }



