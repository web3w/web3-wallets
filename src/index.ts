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

declare global {
    interface Window {
        WalletProvider: IEthereumProvider
    }
}

// https://eips.ethereum.org/EIPS/eip-1193#disconnect
//A JavaScript Ethereum Provider API for consistency across clients and applications.
export class Web3Wallets extends EventEmitter implements IEthereumProvider {
    public walletProvider: IEthereumProvider = new MetaMaskWallet()

    constructor({name}: { name: ProviderNames }) {
        super()
        switch (name) {
            case ProviderNames.Metamask:
                this.walletProvider = new MetaMaskWallet();
                break;
            case ProviderNames.Coinbase:
                this.walletProvider = new CoinbaseWallet();
                break;
            case ProviderNames.WalletConnect:
                this.walletProvider = new ConnectWallet().walletProvider;
                break;
            case ProviderNames.TokenPocket:
                this.walletProvider = new MetaMaskWallet();
                break;
        }
        // @ts-ignore
        window.WalletProvider = this.walletProvider
    }

    async request(args: RequestArguments): Promise<unknown> {
        return await this.walletProvider.request(args)
    };

    async enable(): Promise<ProviderAccounts> {
        return await this.walletProvider.enable()
    };

    // listener(event: string, listener: any): void {
    //     this.emit('Error', "e")
    //
    // }

    sendAsync(request: Object, callback: Function): void {

    };

    async send(...args: unknown[]) {

    };

    // off(event: string, listener: any): void {
    //
    // }
    //
    //
    // on(event: "connect", listener: (info: ProviderInfo) => void): void;
    // on(event: "disconnect", listener: (error: ProviderRpcError) => void): void;
    // on(event: "message", listener: (message: ProviderMessage) => void): void;
    // on(event: "chainChanged", listener: (chainId: ProviderConnectInfo) => void): void;
    // on(event: "accountsChanged", listener: (accounts: ProviderAccounts) => void): void;
    // on(event: string, listener: any): void;
    // on(event: "connect" | "disconnect" | "message" | "chainChanged" | "accountsChanged" | string, listener: any): void {
    // }
    //
    // once(event: string, listener: any): void {
    // }
    //
    // removeListener(event: string, listener: any): void {
    // }
}

// export { MetaMaskWallet, ConnectWallet,CoinbaseWallet, getWalletConnectProvider }
