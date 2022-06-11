// TypeScript
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {ProviderAccounts, WalletNames, IEthereumProvider, RequestArguments} from '../types'
import {BaseWallet} from "./baseWallet";


const APP_NAME = 'Coinbase'
const APP_LOGO_URL = 'https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg'
const DEFAULT_ETH_JSONRPC_URL = "https://mainnet-infura.wallet.coinbase.com"
const DEFAULT_CHAIN_ID = 1;

export class CoinbaseWallet extends BaseWallet {
    // public ethereum: WalletLinkProvider
    public walletName = 'coinbase'
    public provider: any
    public address: string = ''
    public chainId: number = 0
    public host: string = ''


    constructor() {
        super()
        const coinbaseWallet = new CoinbaseWalletSDK({
            appName: APP_NAME,
            appLogoUrl: APP_LOGO_URL,
            darkMode: false
        });

        this.provider = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID)
        this.address = this.provider.selectedAddress || ''
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
