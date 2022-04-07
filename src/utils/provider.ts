import {ethers, providers, Signer} from "ethers";
import {Web3Wallets} from "../index";
import {ProviderNames, WalletInfo} from "../types";

export const RPC_PROVIDER = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed1.defibit.io/',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    137: 'https://rpc-mainnet.maticvigil.com',
    80001: 'https://polygon-mumbai.g.alchemy.com/v2/9NqLsboUltGGnzDsJsOq5fJ740fZPaVE'
}


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

export function getProvider(walletInfo: WalletInfo) {
    const {chainId, address, priKey, rpcUrl} = walletInfo
    const rpc = rpcUrl || RPC_PROVIDER[Number(chainId)]
    // const rpcProvider =
    let walletSigner: Signer | undefined, walletProvider: any

    if (priKey) {
        walletSigner = new ethers.Wallet(priKey, new providers.JsonRpcProvider(rpc))
        walletProvider = walletSigner
    } else {
        // walletSigner = rpcProvider.getSigner(address)
        if (typeof window === 'undefined') {
            console.log('getProvider:There are no priKey')
            walletProvider = (new providers.JsonRpcProvider(rpc)).getSigner(address)
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
    walletSigner = walletSigner || (new providers.JsonRpcProvider(rpc)).getSigner(address)
    return {
        address,
        chainId,
        rpc,
        walletSigner,
        walletProvider
    }
}
