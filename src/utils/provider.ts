import {ethers, providers, Signer} from "ethers";
import {Web3Wallets} from "../index";
import {WalletNames, WalletInfo, JsonRpcRequest} from "../types";
import {getChainInfo} from "./rpc";
import {RPC_API_TIMEOUT} from "../constants";


import {privateKeysToAddress} from "../signature/eip712TypeData";
import {JsonRpcSigner} from "@ethersproject/providers";

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

export function detectWallets() {
    let metamask: Web3Wallets | undefined
    if (typeof window === 'undefined') {
        throw new Error("Only the browser environment is supported")
        // console.warn('not signer fo walletProvider')
    }
    if (window?.ethereum) {
        const walletProvider = window?.ethereum as JsonRpcSigner | any
        // if (walletProvider.overrideIsMetaMask) {
        //     this.provider = walletProvider.provider.providers.find(val => val.isMetaMask)
        // }
        if (walletProvider?.isMetaMask) {
            metamask = new Web3Wallets('metamask')
        }
    }
    const coinbase = new Web3Wallets('coinbase')
    const walletconnect = new Web3Wallets('wallet_connect')
    return {metamask, coinbase, walletconnect}

}

// export function

export function getProvider(walletInfo: WalletInfo) {
    const {chainId, address, privateKeys, rpcUrl} = walletInfo
    const url = {
        ...rpcUrl,
        url: rpcUrl?.url || getChainInfo(chainId).rpcs[0],
        timeout: rpcUrl?.timeout || RPC_API_TIMEOUT
    }
    let walletSigner: Signer | undefined, walletProvider: any
    const network = {
        name: walletInfo.address,
        chainId: walletInfo.chainId
    }

    if (privateKeys && privateKeys.length > 0) {
        const accounts = privateKeysToAddress(privateKeys)
        if (!accounts[address.toLowerCase()]) throw new Error("Private keys does not contain" + address)

        walletSigner = new ethers.Wallet(accounts[address.toLowerCase()], new providers.JsonRpcProvider(url, network))
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
                walletProvider = window?.ethereum as JsonRpcSigner | any
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

