// TypeScript
import WalletLink from 'walletlink'
import {ProviderAccounts, ProviderNames, IEthereumProvider, RequestArguments} from '../types'
import {BaseWallet} from "./baseWallet";


const APP_NAME = 'Coinbase'
const APP_LOGO_URL = 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg'

export class CoinbaseWallet extends BaseWallet {
    // public ethereum: WalletLinkProvider
    public walletName = ProviderNames.Coinbase
    public provider: any
    public address: string = ''
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
        this.provider = walletLink.makeWeb3Provider()
        this.address = this.provider.selectedAddress || ''
        // this.chainId = Number(this.ethereum.chainId)
        this.chainId = Number(this.provider.networkVersion)
        this.host = this.provider.host
        // get chainId(): string;
        // get isWalletLink(): boolean;
        // get isMetaMask(): boolean;
    }

    async request(args: RequestArguments): Promise<unknown> {
        return new Promise<unknown>(async (resolve, reject) => {
            const result = await this.provider.request(args)
            resolve(result)
        })
    };

    async enable(): Promise<ProviderAccounts> {
        return this.provider.request({method: 'eth_requestAccounts'}) // enable ethereum
    }
}
