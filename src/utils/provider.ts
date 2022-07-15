import {ethers, providers, Signer} from "ethers";
import {Web3Wallets} from "../index";
import {WalletNames, WalletInfo} from "../types";
import {getChainInfo} from "./rpc";
import {RPC_API_TIMEOUT} from "../constants";


import {privateKeysToAddress} from "./eip712TypeData";
import {SignerProvider} from "web3-signer-provider";
import {ExternalProvider} from "@ethersproject/providers";
import {TronLinkWallet} from "../connectors/tronlinkWallet";


export async function getTronWallet() {
    return new TronLinkWallet();
}


export async function getWalletInfo(): Promise<WalletInfo> {
    const {metamask, walletconnect} = detectWallets()
    let address = ""
    let chainId = 1
    if (metamask) {
        const accounts = await metamask.enable()
        address = accounts[0]
        chainId = metamask.walletProvider?.chainId || 1
        return {address, chainId}
    }
    const accounts = await walletconnect.enable()
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

export function detectWallets() {
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
            metamask = new Web3Wallets({name: 'metamask'})
        }
    }

    const coinbase = new Web3Wallets({name: 'coinbase'})
    const walletconnect = new Web3Wallets({name: 'wallet_connect'})
    return {metamask, coinbase, walletconnect}
}

export function getProvider(walletInfo: WalletInfo) {
    const {chainId, address, privateKeys, rpcUrl} = walletInfo
    const url = {
        ...rpcUrl,
        url: rpcUrl?.url || getChainInfo(chainId).rpcs[0],
        timeout: rpcUrl?.timeout || RPC_API_TIMEOUT
    }
    let walletSigner: Signer | undefined, walletProvider: ExternalProvider | any
    const network = {
        name: walletInfo.address,
        chainId: walletInfo.chainId
    }

    if (privateKeys && privateKeys.length > 0) {
        const accounts = privateKeysToAddress(privateKeys)
        if (!accounts[address.toLowerCase()]) throw new Error("Private keys does not contain" + address)
        const provider = new providers.JsonRpcProvider(url, network)
        walletSigner = new ethers.Wallet(accounts[address.toLowerCase()], provider)
        walletProvider = new SignerProvider(walletInfo)
        // walletProvider = new providers.Web3Provider(signerProvider).getSigner()
        // walletSigner = walletProvider
    } else {
        // walletSigner = rpcProvider.getSigner(address)
        if (typeof window === 'undefined') {
            console.log('getProvider:There are no priKey')
            walletProvider = new SignerProvider(walletInfo)
            walletSigner = new providers.JsonRpcProvider(url, network).getSigner(address)
        } else {
            if (window.ethereum && !window.walletProvider || window.ethereum && !window.elementWeb3) {
                console.log('getProvider:ethereum')
                walletProvider = window.ethereum as ExternalProvider
                if (walletProvider.selectedAddress) {
                    walletProvider.enable()
                }
                walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
            }
            // // console.log('isMetaMask', window.elementWeb3.isMetaMask)
            // if (window.walletProvider) {
            //     console.log('getProvider:walletProvider')
            //     walletProvider = window.walletProvider
            //     walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
            // }

            if (window.elementWeb3) {
                console.log('getProvider:elementWeb3')
                walletProvider = window.elementWeb3
                if (walletProvider.isWalletConnect) {
                    //JsonRpcSigner wallet connect
                    walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
                } else {
                    // new Web3()
                    //  this.web3.currentProvider
                    walletSigner = new ethers.providers.Web3Provider(walletProvider.currentProvider).getSigner(address)
                }
            }
        }
    }
    walletSigner = walletSigner || (new providers.JsonRpcProvider(url, network)).getSigner(address)
    return {
        address,
        chainId,
        rpcUrl,
        walletSigner,
        walletProvider
    }
}

