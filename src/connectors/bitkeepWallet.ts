

import {
    WalletNames,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError
} from '../types'
import {BaseProvider} from "./baseProvider";


function getProvider() {
    // @ts-ignore
    const provider = window.bitkeep && window.bitkeep.ethereum;
    if (!provider) {
        window.open('https://bitkeep.com/download?type=0&theme=light');
    }
    return provider;
}

//https://docs.bitkeep.com/guide/connect-wallet-for-dapp.html#evm
export class BitKeepWallet extends BaseProvider {
    public walletName: WalletNames = 'bitkeep'
    public provider: any
    public chainId: number
    public address: string
    public accounts: string[] = []

    constructor() {
        super()
        this.provider = getProvider()
        if (this.provider) {
            this.chainId = Number(this.provider.chainId)
            this.address = this.provider.selectedAddress
            this.accounts = [this.address]
        }else {
            throw new Error('Install MetaMask wallet')
        }
        this.registerProviderEvents(this.provider)
    }

    private registerProviderEvents(provider) {
        // Events
        provider.on('connect', (connectInfo: ProviderConnectInfo) => {
            console.log('BitKeep connect SDK', connectInfo)
            this.emit('connect', connectInfo)
        })

        provider.on('disconnect', (error: ProviderRpcError) => {
            // console.log('BitKeep disconnect', error)
            this.emit('disconnect', error)
            this.provider = undefined
            this.chainId = 0
            this.address = ''
            this.accounts = []
        })

        provider.on('chainChanged', async (chainId: string) => {
            this.chainId = Number(chainId)
            this.emit('chainChanged', chainId)
        })

        provider.on('accountsChanged', async (accounts: Array<string>) => {
            // console.log('BitKeep accountsChanged SDK', accounts)
            this.address = accounts[0]
            this.accounts = accounts
            this.emit('accountsChanged', accounts)
        })

        //eth_subscription
        provider.on('message', (payload: ProviderMessage) => {
            // console.log('BitKeep RPC message', payload)
            this.emit('message', payload)
        })
    }

    isUnlocked() {
        return this.provider._metamask.isUnlocked()
    }

}


