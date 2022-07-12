import {
    WalletConnectClient,
    IConnector,
    IRPCMap,
    // IWalletConnectSession,
    WalletConnectProvider
} from "web3-signer-provider";
import {WalletNames} from "../types";
import {BaseWallet} from "./baseWallet";
import {CHAIN_CONFIG, WALLET_CONNECT_BRIDGE} from "../constants";

// const signingMethods = ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign', 'personal_sign', 'eth_sendTransaction']

const bridge = "https://bridge.walletconnect.org"

export class ConnectWallet extends BaseWallet {
    public walletName: WalletNames = 'wallet_connect'//
    public peerMetaName: string = ""
    public provider: any
    // public connector: IConnector
    // public account: string = ''
    public chainId: number = 0
    public rpcList: IRPCMap

    // Create a connector
    constructor(config: { bridge?: string, rpc?: { [chainId: number]: string } }) {
        super()
        const bridge = config.bridge || WALLET_CONNECT_BRIDGE.urls[0] 
        let connector = new WalletConnectClient({
            bridge,// Required
            // qrcodeModal: QRCodeModal
        })

        this.rpcList = config.rpc || {[this.chainId]: CHAIN_CONFIG[this.chainId].rpcs[0]}

        const walletStr = localStorage.getItem('walletconnect')
        if (walletStr) {
            //IWalletConnectSession
            const walletSession = JSON.parse(walletStr)
            connector = new WalletConnectClient({session: walletSession})
            const {chainId, accounts, peerMeta} = walletSession
            this.address = accounts[0]
            this.chainId = Number(chainId)
            this.walletName = "wallet_connect";
            this.peerMetaName = peerMeta?.name || ""

            this.provider = new WalletConnectProvider({
                rpcMap: this.rpcList,
                bridge,
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
            this.walletName = 'wallet_connect';

            this.peerMetaName = peerMeta?.name || ""

            this.provider = new WalletConnectProvider({
                bridge,
                rpcMap: this.rpcList,
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
            // this.walletName = ""
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



