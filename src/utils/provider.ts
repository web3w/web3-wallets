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

export function getWalletName(): { walletName: string, isMobile: boolean, ethereumProvider?: any } {
    let isMobile = false
    if (typeof window === 'undefined') {
        return {walletName: "wallet_signer", isMobile}
    }
    let walletProvider = window.ethereum as any
    let walletName = "wallet_connect"
    if (walletProvider) {
        // if (walletProvider.isMetaMask) {
        //     return 'metamask'
        // }
        if (walletProvider.isFinnie) {
            // @ts-ignore
            const web3 = window.web3 as any
            if (web3) {
                walletProvider = web3.currentProvider
            }
            walletName = 'finnie_wallet'
        }

        if (walletProvider.overrideIsMetaMask || walletProvider.isCoinbaseWallet) {
            // this.provider = walletProvider.provider.providers.find(val => val.isMetaMask)
            isMobile = !walletProvider.isCoinbaseBrowser
            walletName = 'coinbase'
        }

        if (walletProvider.isImToken) {
            isMobile = true
            walletName = 'imtoken'
        }

        if (walletProvider.isMathWallet) {
            walletName = 'math_wallet'
        }

        if (walletProvider.isTokenPocket) {
            isMobile = true
            walletName = 'token_pocket'
        }


        if (walletProvider.isONTO) {
            walletName = 'onto_wallet'
        }

    }
    // @ts-ignore
    if (window.bitkeep) {
        // @ts-ignore
        isMobile = !window.bitkeep.isBitKeepChrome
        // @ts-ignore
        walletProvider = window.bitkeep.ethereum;
        walletName = 'bitkeep'
    }

    // @ts-ignore
    if (window.$onekey) {
        // @ts-ignore
        walletProvider = window.$onekey.ethereum
        walletName = 'onekey'
    }

    if (window.ethereum) {
        walletName = 'metamask'
    }
    return {walletName, isMobile, ethereumProvider:walletProvider}
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
            if ((window.ethereum && !window.walletProvider) || (window.ethereum && !window.elementWeb3)) {
                // console.log('GetProvider:window.ethereum')
                walletProvider = window.ethereum as ExternalProvider
                if (walletProvider.enable) {
                    walletProvider.enable()
                }
                walletSigner = new Web3Provider(walletProvider).getSigner(address)
            }
            if (window.walletProvider) {
                // console.log('GetProvider:window.walletProvider')
                walletProvider = window.walletProvider
                walletSigner = new Web3Provider(walletProvider).getSigner(address)
            }

            if (window.elementWeb3) {
                // console.log('GetProvider:window.elementWeb3')
                walletProvider = window.elementWeb3
                if (walletProvider.isWalletConnect) {
                    //JsonRpcSigner wallet connect
                    console.log('GetProvider:window.elementWeb3  isWalletConnect')
                    walletSigner = new Web3Provider(walletProvider).getSigner(address)
                } else {
                    if (walletProvider.currentProvider?.isMetaMask) {
                        walletSigner = new Web3Provider(walletProvider.currentProvider).getSigner(address)
                    } else if (walletProvider.currentProvider?.provider) {
                        walletSigner = new Web3Provider(walletProvider.currentProvider.provider).getSigner(address)
                    }
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

