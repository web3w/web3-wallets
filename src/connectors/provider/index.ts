import { IConnector, IWalletConnectSession } from '@walletconnect/types'

import WalletConnectProvider from './ethereumProvider'
// import WalletConnectProvider from '@walletconnect/web3-provider'


export const getWalletConnectProvider = (
  chainId: number,
  connector: IConnector
) => {
  // export const apiHostTest = 'api-test.element.market' // 测试服外网接口香港入口
  // export const apiHostTestChina = 'element-api-test.eossql.com' // 测试服外网接口大陆入口
  // export const apiHostEth = 'api.element.market' // 正式服外网接口香港入口
  // /api/v1/jsonrpc
  // /https://api-test.element.market/api/bsc/jsonrpc
  // https://data-seed-prebsc-1-s1.binance.org:8545
  const custom: { [chainId: number]: string } = {
    97: 'https://api-test.element.market/api/bsc/jsonrpc', //BSC TEST
    56: 'https://bsc-dataseed1.defibit.io/', // BSC
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', //
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', //
    137: 'https://rpc-mainnet.maticvigil.com', //
    80001: 'https://rpc-mumbai.matic.today'
  }
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
