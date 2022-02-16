
// import { metamaskProvider } from './metaMask'

export enum ConnectorNames {
  Metamask = 'MetaMask',
  Coinbase = 'Coinbase',
  ImToken = 'ImToken',
  MathWallet = 'MathWallet',
  TokenPocket = 'TokenPocket',
  WalletConnect = 'WalletConnect'
}

// https://eips.ethereum.org/EIPS/eip-1193#disconnect
export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface ProviderMessage {
  type: string
  data: unknown
}

export interface EthSubscription extends ProviderMessage {
  readonly type: 'eth_subscription'
  readonly data: {
    readonly subscription: string
    readonly result: unknown
  }
}

export interface ProviderConnectInfo {
  readonly chainId: string
}

// export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
//   [ConnectorNames.TokenPocket]: metamaskProvider,
//   [ConnectorNames.ImToken]: metamaskProvider,
//   [ConnectorNames.MathWallet]: metamaskProvider,
//   [ConnectorNames.Metamask]: metamaskProvider
// }
