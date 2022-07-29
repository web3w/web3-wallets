// import {providers} from "ethers";
import {Web3Wallets} from "../index";
import {WalletNames, WalletInfo, IQRCodeModal} from "../types";
import {getChainInfo} from "./rpc";
import {RPC_API_TIMEOUT} from "../constants";


import {privateKeysToAddress} from "./eip712TypeData";
import {SignerProvider} from "web3-signer-provider";
import {ExternalProvider, Web3Provider, JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers";
import {Wallet} from "@ethersproject/wallet";
import {TronLinkWallet} from "../connectors/tronlinkWallet";


export async function getTronWallet() {
    return new TronLinkWallet();
}


export async function getWalletInfo(): Promise<WalletInfo> {
    const {metamask, walletconnect} = detectWallets()
    let address = ""
    let chainId = 1
    if (metamask) {
        const accounts = await metamask.connect()
        address = accounts[0]
        chainId = metamask.walletProvider?.chainId || 1
        return {address, chainId}
    }
    const accounts = await walletconnect.connect()
    address = accounts[0]
    chainId = walletconnect.walletProvider?.chainId || 1

    return {address, chainId}
}

export function getWalletName(): string {
    if (typeof window === 'undefined') {
        return "wallet_signer"
    }
    if (window.ethereum) {
        const walletProvider = window.ethereum as any
        if (walletProvider.isMetaMask) {
            return 'metamask'
        }

        if (walletProvider.overrideIsMetaMask) {
            // this.provider = walletProvider.provider.providers.find(val => val.isMetaMask)
            return 'coinbase'
        }

    }
    return "wallet_connect"
}

export function detectWallets(wallet?: WalletInfo) {
    let metamask: Web3Wallets | undefined
    if (typeof window === 'undefined') {
        throw new Error("Only the browser environment is supported")
        // console.warn('not signer fo walletProvider')
    }
    if (window.ethereum) {
        const walletProvider = window.ethereum as any
        // if (walletProvider.overrideIsMetaMask) {
        //     this.provider = walletProvider.provider.providers.find(val => val.isMetaMask)
        // }
        if (walletProvider.isMetaMask) {
            metamask = new Web3Wallets({...wallet, name: 'metamask'})
        }
    }

    const coinbase = new Web3Wallets({...wallet, name: 'coinbase'})
    const walletconnect = new Web3Wallets({...wallet, name: 'wallet_connect'})
    return {metamask, coinbase, walletconnect}
}

export function getProvider(walletInfo: WalletInfo) {
    const {chainId, address, privateKeys, rpcUrl, provider} = walletInfo
    const url = {
        ...rpcUrl,
        url: rpcUrl?.url || getChainInfo(chainId || 1).rpcs[0],
        timeout: rpcUrl?.timeout || RPC_API_TIMEOUT
    }
    let walletSigner: JsonRpcSigner | undefined, walletProvider: ExternalProvider | any
    const network = {
        name: "Rpc Provider",
        chainId: walletInfo.chainId || 1
    }

    if (privateKeys && privateKeys.length > 0) {
        const accounts = privateKeysToAddress(privateKeys)
        const accountPrikey = accounts[address?.toLowerCase() || ""]
        if (!accountPrikey) throw new Error("Private keys does not contain" + address)
        const provider = new JsonRpcProvider(url, network)
        walletSigner = new Wallet(accountPrikey, provider) as any
        walletProvider = new SignerProvider(walletInfo)
        // walletProvider = new  Web3Provider(signerProvider).getSigner()
        // walletSigner = walletProvider
    } else {
        // walletSigner = rpcProvider.getSigner(address)
        if (typeof window === 'undefined') {
            console.log('GetProvider:There are no priKey')
            walletProvider = new SignerProvider(walletInfo)
            walletSigner = new JsonRpcProvider(url, network).getSigner(address)
        } else {
            if (window.ethereum && !window.walletProvider || window.ethereum && !window.elementWeb3) {
                console.log('GetProvider:window.ethereum')
                walletProvider = window.ethereum as ExternalProvider
                if (walletProvider.selectedAddress) {
                    walletProvider.enable()
                }
                walletSigner = new Web3Provider(walletProvider).getSigner(address)
            }
            if (window.walletProvider) {
                console.log('GetProvider:window.walletProvider')
                walletProvider = window.walletProvider
                walletSigner = new Web3Provider(walletProvider).getSigner(address)
            }

            if (window.elementWeb3) {
                console.log('GetProvider:window.elementWeb3')
                walletProvider = window.elementWeb3
                if (walletProvider.isWalletConnect) {
                    //JsonRpcSigner wallet connect
                    console.log('GetProvider:window.elementWeb3  isWalletConnect')
                    walletSigner = new Web3Provider(walletProvider).getSigner(address)
                } else {
                    // new Web3()
                    // this.web3.currentProvider
                    walletSigner = new Web3Provider(walletProvider.currentProvider).getSigner(address)
                }
            }
        }
    }
    if (provider) {
        walletSigner = new Web3Provider(provider).getSigner(address)
        walletProvider = provider
    } else {
        walletSigner = walletSigner || (new JsonRpcProvider(url, network)).getSigner(address)
    }
    return {
        address,
        chainId,
        rpcUrl,
        walletSigner,
        walletProvider
    }
}

