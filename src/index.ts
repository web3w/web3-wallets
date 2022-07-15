import {MetaMaskWallet} from './connectors/metamaskWallet'
import {CoinbaseWallet} from './connectors/coinbaseWallet'
// import {ConnectWallet} from './connectors/walletConnet'
import EventEmitter from 'events'
import {
    IEthereumProvider, JsonRpcPayload, JsonRpcResponse,
    ProviderAccounts,
    RequestArguments, WalletInfo,
    WalletNames
} from "./types";
import {ethers, providers} from "ethers";
import {ExternalProvider, JsonRpcSigner} from "@ethersproject/providers";
import {BaseWallet} from "./connectors/baseWallet"
import {SignerProvider, WalletProvider} from "web3-signer-provider";
import {getWalletName} from "./utils/provider";
import {Buffer} from "buffer";


declare global {
    interface Window {
        walletProvider: BaseWallet | undefined // wallet provider
        walletSigner: JsonRpcSigner | undefined // ethers  wallet provider
        elementWeb3: JsonRpcSigner | any // ethers web3  provider
        Buffer: any
    }
}

// https://eips.ethereum.org/EIPS/eip-1193#disconnect
//A JavaScript Ethereum Provider API for consistency across clients and applications.
export class Web3Wallets extends EventEmitter implements IEthereumProvider {
    public walletProvider: ExternalProvider | any
    public walletSigner: JsonRpcSigner
    public walletName: string

    constructor(wallet?: Partial<WalletInfo>) {
        super()
        // const {name, rpcUrl} = wallet || {}
        const bridge = wallet?.bridge || "https://bridge.walletconnect.org"
        const chainId = wallet?.chainId || 1
        const isBrowser = typeof window !== 'undefined'

        if (isBrowser) {
            window.Buffer = Buffer;
            this.walletName = wallet?.name || getWalletName()
            switch (this.walletName) {
                case 'metamask':
                    this.walletProvider = new MetaMaskWallet();
                    break;
                case 'coinbase':
                    this.walletProvider = new CoinbaseWallet();
                    break;
                case 'wallet_connect':
                    // const conf = {
                    //     bridge
                    // }
                    this.walletProvider = new WalletProvider({bridge, chainId});
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
                default:
                    throw new Error("Wallet not support")
            }
            if (this.walletProvider) {
                this.walletSigner = new ethers.providers.Web3Provider(this.walletProvider).getSigner()
                if (typeof window !== 'undefined') {
                    window.walletProvider = this.walletProvider
                    window.walletSigner = this.walletSigner
                }
            } else {
                throw new Error("Wallet provider is undefind")
            }
        } else {
            this.walletName = wallet?.name || 'wallet_signer'
            if (this.walletName == 'wallet_connect') {
                this.walletProvider = new WalletProvider({bridge, chainId});
            } else {
                this.walletProvider = new SignerProvider({chainId: wallet?.chainId, privateKeys: wallet?.privateKeys})
            }
            this.walletSigner = new ethers.providers.Web3Provider(this.walletProvider).getSigner()
        }
    }

    async request(args: RequestArguments): Promise<unknown> {
        if (!this.walletProvider) {
            throw new Error('Web3-wallet request error')
        }
        return this.walletProvider.request(args)
    };

    public async sendAsync(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void) {
        const res = await this.request(payload) as JsonRpcResponse
        callback(null, res)
    }

    async enable(): Promise<ProviderAccounts> {
        if (!this.walletProvider) {
            throw new Error('Web3-wallet enable error')
        }
        return this.walletProvider.enable()
    };

    async getBlock(): Promise<any> {
        const num = await this.getBlockNumber()
        return this.getBlockByNumber(num)
    }

    async getBlockNumber(): Promise<number> {
        const getBlock = {
            "jsonrpc": "2.0",
            "method": "eth_blockNumber",
            "params": [],
            "id": new Date().getTime()
        }
        const result = await this.request(getBlock) as string
        return Number(result)
    }

    async getBlockByNumber(blockNum: number): Promise<any> {
        const blockHex = "0x" + blockNum.toString(16)
        const getBlock = {
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": [blockHex, true],
            "id": new Date().getTime()
        }
        return this.request(getBlock)
    }

    async getTransactionByHash(txHash: string): Promise<any> {
        const getTxByHash = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [txHash],
            "id": new Date().getTime()
        }
        return this.request(getTxByHash)
    }

    async getTransactionReceipt(txHash: string): Promise<any> {
        const getReceipt = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionReceipt",
            "params": [txHash],
            "id": new Date().getTime()
        }
        return this.request(getReceipt)
    }
}


