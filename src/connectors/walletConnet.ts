import WalletConnectClient from '@walletconnect/client'
import {IConnector, IWalletConnectSession} from '@walletconnect/types'
import QRCodeModal from '@walletconnect/qrcode-modal'
import EthereumProvider from "./provider/ethereumProvider";
import {EventEmitter} from "events";
import {IEthereumProvider, ProviderAccounts, RequestArguments} from "../types";

const signingMethods = ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign', 'personal_sign', 'eth_sendTransaction']

const CHAIN_ID_RPC: { [chainId: number]: string } = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed1.defibit.io/', // BSC
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545', //BSC TEST
    137: 'https://rpc-mainnet.maticvigil.com', // Polygen
    80001: 'https://rpc-mumbai.matic.today'
}

export class ConnectWallet extends EventEmitter implements IEthereumProvider {
    // public walletName: string = ''//ProviderNames.WalletConnect
    public walletProvider: any
    // public connector: IConnector
    // public chainId: string = ''
    public account: string = ''


    // Create a connector
    constructor(config: { bridge: string, rpc?: { [chainId: number]: string } }) {
        super()
        const bridge = config.bridge
        let connector = new WalletConnectClient({
            bridge,// Required
            qrcodeModal: QRCodeModal
        })
        const rpc = config.rpc || CHAIN_ID_RPC

        //
        const walletStr = localStorage.getItem('walletconnect')
        if (walletStr) {
            const walletSession: IWalletConnectSession = <IWalletConnectSession>JSON.parse(walletStr)
            connector = new WalletConnectClient({session: walletSession})
            const chainId = walletSession.chainId
            this.walletProvider = new EthereumProvider({
                rpc,
                chainId,
                connector,
                signingMethods
            })
            this.walletProvider.enable()
        }
        // console.log('connector', this.connector)
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
            console.log('connect 2', payload)
            // Get provided accounts and chainId
            const {accounts, chainId} = payload.params[0]
            // this.chainId = chainId
            this.account = accounts[0]
            this.walletProvider = new EthereumProvider({
                rpc,
                chainId,
                connector,
                signingMethods
            })
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
    };

    async request(args: RequestArguments): Promise<unknown> {
        return this.walletProvider.request(args)
    };

    async enable(): Promise<ProviderAccounts> {
        return this.walletProvider.request({method: 'eth_requestAccounts'}) // enable ethereum
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



