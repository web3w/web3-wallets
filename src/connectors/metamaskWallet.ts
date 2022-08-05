import MetaMaskOnboarding from '@metamask/onboarding';

import {
    WalletNames,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError
} from '../types'
import {BaseProvider} from "./baseProvider";


// https://github.com/metamask/test-dapp
// https://metamask.github.io/test-dapp/
export class MetaMaskWallet extends BaseProvider {
    public walletName: WalletNames = 'metamask'
    public provider: any
    public chainId: number
    public address: string
    public accounts: string[] = []

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
            this.chainId = Number(this.provider.networkVersion)
            this.address = this.provider.selectedAddress
            this.accounts = [this.address]

        } else {
            const onboarding = new MetaMaskOnboarding();
            onboarding.startOnboarding();
            throw new Error('Install MetaMask wallet')
        }

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

        this.registerProviderEvents(this.provider)

    }

    private registerProviderEvents(provider) {
        // Events
        provider.on('connect', (connectInfo: ProviderConnectInfo) => {
            console.log('Matemask connect SDK', connectInfo)
            this.emit('connect', connectInfo)
        })

        provider.on('disconnect', (error: ProviderRpcError) => {
            // console.log('Matemask disconnect', error)
            this.emit('Matemask disconnect', error)
            this.provider = undefined
            this.chainId = 0
            this.address = ''
            this.accounts = []
        })

        provider.on('chainChanged', async (chainId: string) => {
            // console.log('Matemask chainChanged SDK', chainId)
            this.chainId = Number(chainId)
            this.emit('chainChanged', chainId)
        })

        provider.on('accountsChanged', async (accounts: Array<string>) => {
            // console.log('Matemask accountsChanged SDK', accounts)
            this.address = accounts[0]
            this.accounts = accounts
            this.emit('accountsChanged', accounts)
        })

        //eth_subscription
        provider.on('message', (payload: ProviderMessage) => {
            // console.log('Matemask RPC message', payload)
            this.emit('message', payload)
        })
    }

    // async request(args: RequestArguments): Promise<unknown> {
    //     return new Promise<unknown>(async (resolve, reject) => {
    //         const result = await this.provider.request(args)
    //         resolve(result)
    //     })
    // };

    isUnlocked() {
        return this.provider._metamask.isUnlocked()
    }

}


