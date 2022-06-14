import {MetaMaskWallet} from './connectors/metamaskWallet'
import {CoinbaseWallet} from './connectors/coinbaseWallet'
import {ConnectWallet} from './connectors/walletConnet'
import EventEmitter from 'events'
import {
    IEthereumProvider,
    ProviderAccounts,
    RequestArguments, WalletInfo,
    WalletNames
} from "./types";
import {ethers} from "ethers";
import {JsonRpcSigner} from "@ethersproject/providers";
import {BaseWallet} from "./connectors/baseWallet"
import {CHAIN_CONFIG} from "./constants/chain";

declare global {
    interface Window {
        walletProvider: BaseWallet | undefined // wallet provider
        walletSigner: JsonRpcSigner | undefined // ethers  wallet provider
        elementWeb3: JsonRpcSigner | any // ethers web3  provider
    }
}

// https://eips.ethereum.org/EIPS/eip-1193#disconnect
//A JavaScript Ethereum Provider API for consistency across clients and applications.
export class Web3Wallets extends EventEmitter implements IEthereumProvider {
    public walletProvider: BaseWallet | undefined
    public walletSigner: JsonRpcSigner | undefined
    public walletName: WalletNames | undefined

    constructor(name?: WalletNames, options?: Partial<WalletInfo>) {
        super()
        // bridge?: string, rpc?: { [chainId: number]: string }
        const {address, chainId, bridge, rpcUrl} = options || {}

        this.walletName = name || 'wallet_connect'
        if (typeof window === 'undefined') {
            throw 'not support node evn'
        } else {
            switch (name) {
                case 'metamask':
                    this.walletProvider = new MetaMaskWallet();
                    break;
                case 'coinbase':
                    this.walletProvider = new CoinbaseWallet();
                    break;
                case 'wallet_connect':
                    let rpc
                    if (chainId && !rpcUrl) {
                        const url = CHAIN_CONFIG[chainId].rpcs[0]
                        rpc = {[chainId]: url}
                    }
                    if (chainId && rpcUrl) {
                        rpc = {[chainId]: rpcUrl}
                    }
                    const conf = {
                        bridge,
                        rpc
                    }
                    this.walletProvider = new ConnectWallet(conf);
                    break;
                case 'token_pocket':
                    this.walletProvider = new MetaMaskWallet();
                    break;
                case 'bitkeep':
                    this.walletProvider = new MetaMaskWallet();
                    break;
                case 'coin98':
                    this.walletProvider = new MetaMaskWallet();
                    break;
                case 'wallet_proxy':
                    const walletInfo = {address: address || "", chainId: chainId || 1}
                    // this.walletProvider = new ProxyWallet(walletInfo)
                    break;
            }
            if (this.walletProvider) {
                this.walletSigner = new ethers.providers.Web3Provider(this.walletProvider).getSigner()
                if (typeof window !== 'undefined') {
                    window.walletProvider = this.walletProvider
                    window.walletSigner = this.walletSigner
                }
            }
        }
    }

    async request(args: RequestArguments): Promise<unknown> {
        if (!this.walletProvider) {
            throw new Error('Web3-wallet request error')
        }
        return this.walletProvider?.request(args)
    };

    async enable(): Promise<ProviderAccounts> {
        if (!this.walletProvider) {
            throw new Error('Web3-wallet enable error')
        }
        return this.walletProvider.enable()
    };


}



