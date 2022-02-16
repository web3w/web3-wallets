// TypeScript
import WalletLink from 'walletlink'
import { WalletLinkProvider } from 'walletlink/dist/provider/WalletLinkProvider'
import { EventEmitter } from 'events'
import { ConnectorNames } from './index'
// import Web3 from 'web3'

const APP_NAME = 'Coinbase'
const APP_LOGO_URL = 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg'

export class CoinbaseWallet extends EventEmitter {
  // public ethereum: WalletLinkProvider
  public walletProvider: any
  public account: string = ''
  public chainId: number = 0
  public host: string = ''
  public walletName = ConnectorNames.Coinbase

  constructor({ chainId, rpcUrl }: {
    chainId?: number, rpcUrl?: string
  }) {
    super()
    const walletLink = new WalletLink({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: false
    })
    this.walletProvider = walletLink.makeWeb3Provider(rpcUrl, chainId)
    this.account = this.walletProvider.selectedAddress || ''
    // this.chainId = Number(this.ethereum.chainId)
    this.chainId = Number(this.walletProvider.networkVersion)
    this.host = this.walletProvider.host
    // get chainId(): string;
    // get isWalletLink(): boolean;
    // get isMetaMask(): boolean;
  }

  async requestAccounts() {
    const accountList: [string] = await this.walletProvider.request({ method: 'eth_requestAccounts' }) // enable ethereum
    this.account = accountList[0]
    return accountList
  }
}
