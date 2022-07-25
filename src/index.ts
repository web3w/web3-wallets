import {MetaMaskWallet} from './connectors/metamaskWallet'
import {CoinbaseWallet} from './connectors/coinbaseWallet'
import EventEmitter from 'events'
import {
    EIP1193Provider,
    JsonRpcPayload, JsonRpcResponse, LimitedCallSpec,
    ProviderAccounts,
    RequestArguments, TransactionRequest, WalletInfo
} from "./types";
import {ExternalProvider, JsonRpcSigner, Web3Provider} from "@ethersproject/providers";
import {SignerProvider, WalletProvider} from "web3-signer-provider";
import {getWalletName} from "./utils/provider";
import {EIP712TypedData} from "./utils/eip712TypeData";
import {arrayify, Bytes, isHexString} from "@ethersproject/bytes";
import {BigNumber} from "./constants/index";
import {get1559Fee} from "./utils/fee";
import pkg from "../package.json"
import {BaseProvider} from "./connectors/baseProvider";

declare global {
    interface Window {
        walletProvider: BaseProvider | undefined // wallet provider
        walletSigner: JsonRpcSigner | undefined // ethers  wallet provider
        elementWeb3: JsonRpcSigner | any // ethers web3  provider
    }
}

// https://eips.ethereum.org/EIPS/eip-1193#disconnect
//A JavaScript Ethereum Provider API for consistency across clients and applications.
export class Web3Wallets extends EventEmitter implements EIP1193Provider {
    public walletProvider: ExternalProvider | any
    public walletSigner: JsonRpcSigner
    public version = pkg.version
    public wallet


    constructor(wallet?: Partial<WalletInfo>) {
        super()
        this.wallet = wallet
        const bridge = wallet?.bridge || "https://bridge.walletconnect.org"
        const chainId = wallet?.chainId || 1
        const isBrowser = typeof window !== 'undefined'

        const walletName = wallet?.name || getWalletName()
        if (isBrowser) {
            switch (walletName) {
                case 'metamask':
                    this.walletProvider = new MetaMaskWallet();
                    break;
                case 'coinbase':
                    this.walletProvider = new CoinbaseWallet();
                    break;
                case 'wallet_connect':
                    this.walletProvider = new WalletProvider({bridge, chainId, qrcodeModal: wallet?.qrcodeModal});
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
                this.walletSigner = new Web3Provider(this.walletProvider).getSigner()
            } else {
                throw new Error("Wallet provider is undefind")
            }
        } else {
            if (walletName == 'wallet_connect') {
                this.walletProvider = new WalletProvider({bridge, chainId});
            } else {
                this.walletProvider = new SignerProvider({chainId: wallet?.chainId, privateKeys: wallet?.privateKeys})
            }
            this.walletSigner = new Web3Provider(this.walletProvider).getSigner()
        }

        // wallet config
        if (wallet?.provider) {
            this.walletProvider = wallet.provider
            this.walletSigner = new Web3Provider(this.walletProvider).getSigner()
        }

        if (typeof window !== 'undefined') {
            window.walletProvider = this.walletProvider
            window.walletSigner = this.walletSigner
        }
    }

    get walletName() {
        return this.walletProvider.walletName
    }

    get address() {
        return this.walletProvider.address
    }

    get chainId() {
        return this.walletProvider.chainId
    }

    async request(args: RequestArguments): Promise<unknown> {
        if (!this.walletProvider) {
            throw new Error('Web3-wallet request error')
        }
        return this.walletProvider.request(args)
    };

    async sendAsync(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void) {
        const res = await this.request(payload) as JsonRpcResponse
        callback(null, res)
    }

    async connect(): Promise<ProviderAccounts> {
        if (!this.walletProvider) {
            throw new Error('Web3-wallet enable error')
        }

        if (this.walletName == "wallet_connect") {
            const provider = this.walletProvider

            if (provider.connected) {
                const walletStr = localStorage.getItem('walletconnect')
                if (walletStr) {
                    const walletSession = JSON.parse(walletStr)
                    const {chainId, accounts, peerMeta} = walletSession
                    provider.peerMetaName = peerMeta?.name || ""
                }

            } else {
                await provider.open()
            }
            provider.on('connect', async (error, payload) => {
                const {accounts, chainId, peerMeta} = payload
                provider.peerMetaName = peerMeta?.name || ""
                this.walletProvider = provider
            })
            provider.on('disconnect', async (error) => {
                console.log("web3-wallets disconnect")
                // this.walletProvider = undefined
            })
        }
        return this.walletProvider.connect()
    };

    async signMessage(message: string | Bytes): Promise<string> {
        if (isHexString(message)) {
            message = arrayify(message)
        }
        return this.walletSigner.signMessage(message).catch((error: any) => {
            throw error
        })
    }

    async signTypedData(typedData: EIP712TypedData): Promise<string> {

        const types = Object.assign({}, typedData.types)
        if (types.EIP712Domain) {
            delete types.EIP712Domain
        }
        const domain = typedData.domain
        const value = typedData.message
        return (<any>this.walletSigner)._signTypedData(domain, types, value).catch((error: any) => {
            this.emit('SignTypedData', error)
            throw error
        })
    }

    async sendTransaction(callData: LimitedCallSpec) {
        let value = "0"
        if (callData.value) {
            value = value.toString()
        }
        const transactionObject = {
            from: this.wallet?.address,
            to: callData.to,
            data: callData.data,
            value
        } as TransactionRequest

        const chainId = this.wallet?.chainId || 1
        if (chainId == 97 || chainId == 56 || chainId == 43113 || chainId == 43114 || chainId == 137 || chainId == 80001) {
            this.wallet.offsetGasLimitRatio = this.wallet.offsetGasLimitRatio || 1.5
        }

        if (this.wallet.offsetGasLimitRatio) {
            if (this.wallet.offsetGasLimitRatio < 1) throw 'Offset must be greater than 1 '
            const offsetRatio = this.wallet.offsetGasLimitRatio || 1
            const gasLimit = await this.walletSigner.estimateGas(transactionObject)
            const offsetGasLimit = new BigNumber(gasLimit.toString() || "0").times(offsetRatio).toFixed(0)
            transactionObject.gasLimit = offsetGasLimit.toString()
        }

        if (this.wallet.isSetGasPrice) {
            const tx: TransactionRequest = await this.walletSigner.populateTransaction(transactionObject).catch(async (error: any) => {
                throw error
            })
            if (tx?.type == 2) {
                const fee = await get1559Fee(this.wallet.rpcUrl?.url)
                transactionObject.maxFeePerGas = fee.maxFeePerGas //?.mul(gasPriceOffset).div(100).toNumber()
                transactionObject.maxPriorityFeePerGas = fee.maxPriorityFeePerGas//?.mul(gasPriceOffset).div(100).toNumber()
            } else {
                const fee = await this.walletSigner.getFeeData()
                transactionObject.gasPrice = fee.gasPrice || "0"
            }
        }
        try {
            return this.walletSigner.sendTransaction(transactionObject).catch((e: any) => {
                throw e
            })
        } catch (e: any) {
            throw e
        }
    }

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


