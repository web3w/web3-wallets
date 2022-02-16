import { MetaMaskWallet } from './connectors/metamaskWallet'
import { CoinbaseWallet } from './connectors/coinbaseWallet'
import { ConnectWallet, getWalletConnectProvider } from './connectors/walletConnet'

declare global {
  interface Window {
    walletConnectProvider: any
    walletConnector: any
  }
}
export { MetaMaskWallet, ConnectWallet,CoinbaseWallet, getWalletConnectProvider }
