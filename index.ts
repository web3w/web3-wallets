export {MetaMaskWallet} from './src/connectors/metamaskWallet'
export {CoinbaseWallet} from './src/connectors/coinbaseWallet'
export {ConnectWallet} from './src/connectors/walletConnet'

export {Web3Wallets} from './src/index'

export {ProviderNames} from './src/types'

export {get1559Fee} from './src/utils/fee'
// RPC
export {getProvider, ethSend, getEstimateGas} from './src/utils/rpc'
export type {WalletInfo, LimitedCallSpec, RPC_PROVIDER} from './src/utils/rpc'

