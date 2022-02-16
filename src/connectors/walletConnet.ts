import WalletConnectClient from '@walletconnect/client'
import { IConnector, IWalletConnectSession } from '@walletconnect/types'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { getWalletConnectProvider } from './provider'

export { getWalletConnectProvider }

export class ConnectWallet {
  // public walletName: string = ''//ConnectorNames.WalletConnect
  public walletProvider: any
  public connector: IConnector
  public chainId: string = ''
  public account: string = ''
  // public bridge="https://element-api-test.eossql.com/bridge/walletconnect"
  public bridge = 'https://element-api.eossql.com/bridge/walletconnect'
  // public bridge='https://bridge.walletconnect.org'

// Create a connector
  constructor() {
    let connector = new WalletConnectClient({
      bridge: this.bridge, // Required
      qrcodeModal: QRCodeModal
    })
    const walletStr = localStorage.getItem('walletconnect')
    if (walletStr) {
      const wallet: IWalletConnectSession = <IWalletConnectSession>JSON.parse(walletStr)
      connector = new WalletConnectClient({ session: wallet })
      this.walletProvider = getWalletConnectProvider(wallet.chainId, connector)
      this.walletProvider.enable()
    }

    this.connector = connector


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
      console.log('connect 2', payload)
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0]
      this.chainId = chainId
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
      const { accounts, chainId } = payload.params[0]
      this.chainId = chainId
      this.account = accounts[0]
    })

    connector.on('disconnect', (error) => {
      if (error) {
        throw error
      }
      console.log('disconnect', error)
      this.chainId = ''
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



