// TypeScript
import WalletLink from 'walletlink'
import {EventEmitter} from 'events'
import {ProviderAccounts, ProviderNames, IEthereumProvider, RequestArguments} from '../types'



const APP_NAME = 'Coinbase'
const APP_LOGO_URL = 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg'

export class CoinbaseWallet extends EventEmitter implements IEthereumProvider {
    // public ethereum: WalletLinkProvider
    public walletName = ProviderNames.Coinbase
    public walletProvider: any
    public account: string = ''
    public chainId: number = 0
    public host: string = ''


    constructor() {
        super()
        const walletLink = new WalletLink({
            appName: APP_NAME,
            appLogoUrl: APP_LOGO_URL,
            darkMode: false
        })
        //rpcUrl, this.chainId)
        this.walletProvider = walletLink.makeWeb3Provider()
        this.account = this.walletProvider.selectedAddress || ''
        // this.chainId = Number(this.ethereum.chainId)
        this.chainId = Number(this.walletProvider.networkVersion)
        this.host = this.walletProvider.host
        // get chainId(): string;
        // get isWalletLink(): boolean;
        // get isMetaMask(): boolean;
    }

    async request(args: RequestArguments): Promise<unknown> {
        return new Promise<unknown>(async (resolve, reject) => {
            const result = await this.walletProvider.request(args)
            resolve(result)
        })
    };

    async enable(): Promise<ProviderAccounts> {
        return this.walletProvider.request({method: 'eth_requestAccounts'}) // enable ethereum
    }
}
