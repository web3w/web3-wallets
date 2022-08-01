import MetaMaskOnboarding from '@metamask/onboarding';

import {
    WalletNames,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError, RequestArguments, ProviderAccounts
} from '../types'
import {BaseProvider} from "./baseProvider";


// https://github.com/metamask/test-dapp
// https://metamask.github.io/test-dapp/
export class MetaMaskWallet extends BaseProvider {
    public walletName: WalletNames = 'metamask'
    public provider: any
    public chainId: number
    public address: string

    constructor(name?: string) {
        super()
        this.provider = window.ethereum
        if (this.provider) {
            // adapter coinbase wallet
            if (this.provider.overrideIsMetaMask) {
                const provider = this.provider.providerMap.get("MetaMask")
                if (!provider) {
                    const onboarding = new MetaMaskOnboarding();
                    onboarding.startOnboarding();
                    throw new Error('Install MetaMask wallet')
                }
                this.provider = provider
            }
            // if (!this.isUnlocked()) {
            //     this.enable()
            // }
            this.chainId = Number(this.provider.networkVersion)
            this.address = this.provider.selectedAddress

        } else {
            // throw new Error('Please install MetaMask wallet')
            const onboarding = new MetaMaskOnboarding();
            onboarding.startOnboarding();
            throw new Error('Install MetaMask wallet')
        }

        // 判断钱包
        const provider = this.provider
        if (provider && provider.isImToken) {
            this.walletName = 'imtoken'
        }
        if (provider && provider.isMathWallet) {
            this.walletName = 'math_wallet'
        }
        if (provider && provider.isTokenPocket) {
            this.walletName = 'token_pocket'
        }
        // @ts-ignore
        if (name == "one_key" && window.$onekey) {
            // @ts-ignore
            this.provider = window.$onekey.ethereum
            this.walletName = 'one_key'
        }

        // Events
        this.provider.on('connect', (connectInfo: ProviderConnectInfo) => {
            console.log('Matemask connect SDK', connectInfo)
            this.emit('connect', connectInfo)
            this.chainId = 0
            this.address = ''
        })

        this.provider.on('disconnect', (error: ProviderRpcError) => {
            // console.log('Matemask disconnect', error)
            this.emit('Matemask disconnect', error)
            this.provider = undefined
            this.chainId = 0
            this.address = ''
        })

        this.provider.on('chainChanged', async (chainId: string) => {
            console.log('Matemask chainChanged SDK', chainId)
            this.chainId = Number(chainId)
            this.emit('chainChanged', chainId)
            // window.location.reload()
        })

        this.provider.on('accountsChanged', async (accounts: Array<string>) => {
            console.log('Matemask accountsChanged SDK', accounts)
            this.address = accounts[0]
            this.emit('accountsChanged', accounts)
        })

        //eth_subscription
        this.provider.on('message', (payload: ProviderMessage) => {
            // console.log('Matemask RPC message', payload)
            this.emit('message', payload)
        })
    }

    async request(args: RequestArguments): Promise<unknown> {
        return new Promise<unknown>(async (resolve, reject) => {
            const result = await this.provider.request(args)
            resolve(result)
        })
    };

    async connect(): Promise<ProviderAccounts> {
        const accounts = await this.provider.request({method: 'eth_requestAccounts'})
        this.chainId = Number(this.provider.networkVersion)
        this.address = this.provider.selectedAddress
        return accounts // enable ethereum
    }

    isUnlocked() {
        return this.provider._metamask.isUnlocked()
    }


    // Mobile
    async scanQRCode(params) {
        this.provider.request({
            method: 'wallet_scanQRCode',
            // The regex string must be valid input to the RegExp constructor, if provided
            params: ['\\D'],
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
    }
}

// async onConnectMetaMask(): Promise<any> {
//     //
//     const accounts = await this.provider.request({method: 'eth_requestAccounts'})
//     const walletChainId = await this.provider.request({method: 'eth_chainId'})
//     console.log('wallet isConnected', this.provider.isConnected())
//     this.address = accounts[0]
//     return accounts
// }

// async switchBSCTEST() {
//     const rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545'
//     await this.switchEthereumChain('0x61')
// }
//
// async switchBSC() {
//     const rpcUrl = 'https://bsc-dataseed1.defibit.io/'
//     await this.switchEthereumChain('0x38')
// }
//
// async switchRinkeby() {
//     const rpcUrl = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
//     await this.switchEthereumChain('0x4', rpcUrl)
// }

