import {ethers, providers, Signer} from "ethers";
import {Web3Wallets} from "../index";
import {ProviderNames, WalletInfo} from "../types";
import {getChainInfo} from "./rpc";
import {RPC_API_TIMEOUT} from "../constants";

export function detectWallets() {
    let metamask: Web3Wallets | undefined
    if (typeof window === 'undefined') {
        throw "evn not sprot"
        // console.warn('not signer fo walletProvider')
    }
    if (window.ethereum) {
        const walletProvider = window.ethereum
        // if (walletProvider.overrideIsMetaMask) {
        //     this.provider = walletProvider.provider.providers.find(val => val.isMetaMask)
        // }

        if (walletProvider.isMetaMask) {
            metamask = new Web3Wallets(ProviderNames.Metamask)
        }
    }
    const coinbase = new Web3Wallets(ProviderNames.Coinbase)
    const walletconnect = new Web3Wallets(ProviderNames.WalletConnect)
    return {metamask, coinbase, walletconnect}

}

export function getProvider(walletInfo: WalletInfo, options?: {
    timeout?: number
}) {
    const {timeout} = options || {}
    const {chainId, address, priKey, rpcUrl} = walletInfo
    const rpc = rpcUrl || getChainInfo(chainId).rpcs[0]
    const url = {url: rpc, timeout: timeout || RPC_API_TIMEOUT}
    // const rpcProvider =
    let walletSigner: Signer | undefined, walletProvider: any
    const network = {
        name: walletInfo.address,
        chainId: walletInfo.chainId
    }

    if (priKey) {
        walletSigner = new ethers.Wallet(priKey, new providers.JsonRpcProvider(url, network))
        walletProvider = walletSigner
    } else {
        // walletSigner = rpcProvider.getSigner(address)
        if (typeof window === 'undefined') {
            console.log('getProvider:There are no priKey')
            walletProvider = (new providers.JsonRpcProvider(url, network)).getSigner(address)
            walletSigner = walletProvider
        } else {
            if (window.ethereum && !window.walletProvider || window.ethereum && !window.elementWeb3) {
                console.log('getProvider:ethereum')
                walletProvider = window.ethereum
                if (!window.ethereum.selectedAddress) {
                    window.ethereum.enable()
                }
                walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
            }
            // console.log('isMetaMask', window.elementWeb3.isMetaMask)
            if (window.walletProvider) {
                console.log('getProvider:walletProvider')
                walletProvider = window.walletProvider
                walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
            }

            if (window.elementWeb3) {
                console.log('getProvider:elementWeb3')
                walletProvider = window.elementWeb3
                if (walletProvider.isWalletConnect) {
                    //JsonRpcSigner wallet connect
                    walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
                } else {
                    // new Web3()
                    walletSigner = new ethers.providers.Web3Provider(walletProvider.currentProvider).getSigner(address)
                }
            }
        }
    }
    walletSigner = walletSigner || (new providers.JsonRpcProvider(url, network)).getSigner(address)
    return {
        address,
        chainId,
        rpc,
        walletSigner,
        walletProvider
    }
}
