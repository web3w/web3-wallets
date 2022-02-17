import {MetaMaskWallet} from './connectors/metamaskWallet'
import {CoinbaseWallet} from './connectors/coinbaseWallet'
import {ConnectWallet} from './connectors/walletConnet'
import {EventEmitter} from 'events'
import {
    IEthereumProvider,
    ProviderAccounts,
    RequestArguments,
    ProviderNames
} from "./types";
import {ethers} from "ethers";
import {JsonRpcSigner} from "@ethersproject/providers";


declare global {
    interface Window {
        WalletProvider: IEthereumProvider | undefined
        WalletSigner: JsonRpcSigner | undefined
    }
}

const bridgeUrl = 'https://bridge.walletconnect.org'

// https://eips.ethereum.org/EIPS/eip-1193#disconnect
//A JavaScript Ethereum Provider API for consistency across clients and applications.
export class Web3Wallets extends EventEmitter implements IEthereumProvider {
    public walletProvider: IEthereumProvider | undefined
    public walletSigner: JsonRpcSigner | undefined

    constructor(name: ProviderNames, config?: {
        bridge?: string, rpc?: { [chainId: number]: string }
    }) {
        super()
        switch (name) {
            case ProviderNames.Metamask:
                this.walletProvider = new MetaMaskWallet();
                break;
            case ProviderNames.Coinbase:
                this.walletProvider = new CoinbaseWallet();
                break;
            case ProviderNames.WalletConnect:
                const conf = {
                    bridge: config?.bridge || bridgeUrl,
                    rpc: config?.rpc
                }
                this.walletProvider = new ConnectWallet(conf).walletProvider;
                break;
            case ProviderNames.TokenPocket:
                this.walletProvider = new MetaMaskWallet();
                break;
        }
        window.WalletProvider = this.walletProvider
        if (this.walletProvider) {
            this.walletSigner = new ethers.providers.Web3Provider(this.walletProvider).getSigner()
            window.WalletSigner = this.walletSigner
        }

    }

    private errorHandle() {
        if (!this.walletProvider) {
            this.emit("Error")
            throw ''
        }
    }

    async request(args: RequestArguments): Promise<unknown> {
        this.errorHandle()
        return this.walletProvider?.request(args)
    };

    async enable(): Promise<ProviderAccounts> {
        if (!this.walletProvider) {
            this.emit("Error")
            throw ''
        }
        return this.walletProvider?.enable()
    };

    static async getFee() {

    }



    sendAsync(request: Object, callback: Function): void {

    };

    async send(...args: unknown[]) {

    };

}
