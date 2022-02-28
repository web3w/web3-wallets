import {ethers, providers, Signer} from "ethers";
import {Web3Wallets} from "../index";
import {ProviderNames} from "../types";

export const RPC_PROVIDER = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed1.defibit.io/',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    137: 'https://rpc-mainnet.maticvigil.com',
    80001: 'https://polygon-mumbai.g.alchemy.com/v2/9NqLsboUltGGnzDsJsOq5fJ740fZPaVE'
}


export interface WalletInfo {
    chainId: number;
    address: string;
    exSchema?: string;
    priKey?: string;
    rpcUrl?: string;
}

export function detectWallets() {
    let metamask: Web3Wallets | undefined

    if (typeof window === 'undefined') {
        throw "evn not sprot"
        // console.warn('not signer fo walletProvider')
    }
    if (window.ethereum) {
        const walletProvider = window.ethereum
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
    const rpcProvider = new providers.JsonRpcProvider(rpc)

    let walletSigner: Signer, walletProvider: any

    if (priKey) {
        walletSigner = new ethers.Wallet(priKey, rpcProvider)
        walletProvider = walletSigner
    } else {
        walletSigner = rpcProvider.getSigner(address)
        if (typeof window === 'undefined') {
            walletProvider = rpcProvider.getSigner(address)
            walletSigner = walletProvider
        } else {
            if (window.ethereum) {
                walletProvider = window.ethereum
                if (!window.ethereum.selectedAddress) {
                    window.ethereum.enable()
                }
                walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
            }
            // console.log('isMetaMask', window.elementWeb3.isMetaMask)
            if (window.elementWeb3 || window.walletProvider) {
                walletProvider = window.elementWeb3 ? window.elementWeb3 : window.walletProvider
                if (walletProvider.isWalletConnect) {
                    walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
                } else {
                    //JsonRpcSigner
                    walletSigner = new ethers.providers.Web3Provider(walletProvider.currentProvider).getSigner(address)
                }
            }
        }
    }

    return {
        address,
        chainId,
        rpc,
        walletSigner,
        walletProvider
    }
}
