import WalletConnectClient from '@walletconnect/client'
import {IConnector, IWalletConnectSession} from '@walletconnect/types'
import QRCodeModal from '@walletconnect/qrcode-modal'
import EthereumProvider from "./provider/ethereumProvider";
import {WalletNames} from "../types";
import {BaseWallet} from "./baseWallet";
import {CHAIN_CONFIG, WALLET_CONNECT_BRIDGE} from "../constants";

// const signingMethods = ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign', 'personal_sign', 'eth_sendTransaction']

//    EthereumProvider config   signingMethods
// const CHAIN_ID_RPC: { [chainId: number]: string } = {
//     1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
//     4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
//     56: 'https://bsc-dataseed1.defibit.io/', // BSC
//     97: 'https://data-seed-prebsc-1-s1.binance.org:8545', //BSC TEST
//     137: 'https://rpc-mainnet.maticvigil.com', // Polygen
//     80001: 'https://rpc-mumbai.matic.today'
// }
export class ConnectWallet extends BaseWallet {
    public walletName: string = WalletNames.WalletConnect//
    public peerMetaName: string = ""
    public provider: any
    // public connector: IConnector
    // public account: string = ''
    public chainId: number = 0
    public rpcList: { [chainId: number]: string }

    // Create a connector
    constructor(config: { bridge?: string, rpc?: { [chainId: number]: string } }) {
        super()
        const bridge = config.bridge || WALLET_CONNECT_BRIDGE.urls[0]

        let connector = new WalletConnectClient({
            bridge,// Required
            qrcodeModal: QRCodeModal
        })

        this.rpcList = config.rpc || {[this.chainId]: CHAIN_CONFIG[this.chainId].rpcs[0]}

        const walletStr = localStorage.getItem('walletconnect')
        if (walletStr) {
            const walletSession: IWalletConnectSession = <IWalletConnectSession>JSON.parse(walletStr)
            connector = new WalletConnectClient({session: walletSession})
            const {chainId, accounts, peerMeta} = walletSession
            this.address = accounts[0]
            this.chainId = Number(chainId)
            this.walletName = WalletNames.WalletConnect;
            this.peerMetaName = peerMeta?.name || ""

            this.provider = new EthereumProvider({
                rpc: this.rpcList,
                chainId,
                connector
            })
            this.provider.enable()
        }
        // console.log('connector', this.connector)
        // Check if connection is already established
        if (!connector.connected) {
            // create new session
            // connector.createSession()
            this.provider = connector
        }

    };

    getConnector(): IConnector {
        let connector = this.provider
        if (this.provider.connected) {
            connector = this.provider.connector
        } else {
            connector.createSession()
        }
        // Subscribe to connection events
        connector.on('connect', async (error, payload) => {
            if (error) {
                throw error
            }
            // Get provided accounts and chainId
            const {accounts, chainId, peerMeta} = payload.params[0]
            this.address = accounts[0]
            this.chainId = Number(chainId)
            this.walletName = WalletNames.WalletConnect;

            this.peerMetaName = peerMeta?.name || ""

            this.provider = new EthereumProvider({
                rpc: this.rpcList,
                chainId,
                connector
            })
            this.provider.enable()
            this.emit('connect', error, payload)
        })

        connector.on('session_update', (error, payload) => {
            debugger
            if (error) {
                throw error
            }
            console.log('session_update', payload)
            // Get updated accounts and chainId
            const {accounts, chainId} = payload.params[0]
            this.chainId = chainId
            this.address = accounts[0]
            this.emit('session_update', {error, payload})
        })

        connector.on('disconnect', (error) => {
            debugger
            if (error) {
                throw error
            }
            console.log('disconnect', error)
            this.address = ''
            this.chainId = 0
            this.walletName = ""
            this.peerMetaName = ""
            this.emit('disconnect', error)
        })

        return connector
    }

    disconnect() {
        this.emit('disconnect', 'client')
        this.provider.disconnect();
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
//       this.address                          // Required
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
//       this.address,                            // Required
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
//           from: this.address,
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



