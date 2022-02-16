import {
    ProviderNames,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError,
    IEthereumProvider,
    RequestArguments, ProviderAccounts
} from '../types'
import {EventEmitter} from "events";

// https://github.com/metamask/test-dapp
// https://metamask.github.io/test-dapp/

export class MetaMaskWallet extends EventEmitter implements IEthereumProvider {
    public walletName = ProviderNames.Metamask
    public walletProvider: any
    public chainId: number
    public account: string

    constructor() {
        super()
        this.walletProvider = window.ethereum
        if (this.walletProvider) {
            console.log(this.walletProvider)
            // this.chainId = Number(this.walletProvider.chainId)
            this.chainId = Number(this.walletProvider.networkVersion)
            this.account = this.walletProvider.selectedAddress
        } else {
            throw 'Please install wallet'
        }

        // 判断钱包
        const provider = this.walletProvider
        if (provider && provider.isImToken) {
            this.walletName = ProviderNames.ImToken
        }
        if (provider && provider.isMathWallet) {
            this.walletName = ProviderNames.MathWallet
        }
        if (provider && provider.isTokenPocket) {
            this.walletName = ProviderNames.TokenPocket
        }

        // Events
        provider.on('connect', (connectInfo: ProviderConnectInfo) => {
            console.log('Matemask connect', connectInfo)
            this.emit('connect', connectInfo)
            this.chainId = 0
            this.account = ''
        })

        // 断开链接
        provider.on('disconnect', (error: ProviderRpcError) => {
            console.log('Matemask disconnect', error)
            this.emit('disconnect', error)
            this.walletProvider = undefined
            this.chainId = 0
            this.account = ''
        })

        // 更改网络事件
        provider.on('chainChanged', async (walletChainId: string) => {
            console.log('Matemask chainChanged', walletChainId)
            this.emit('disconnect', walletChainId)
            // window.location.reload()
        })

        // 账户变动事件
        provider.on('accountsChanged', async (accounts: Array<string>) => {
            console.log('Matemask accountsChanged', accounts)
            this.emit('accountsChanged', accounts)
        })

        //eth_subscription
        provider.on('message', (payload: ProviderMessage) => {
            console.log('Matemask RPC message', payload)
            this.emit('message', payload)
        })
    }

    async request(args: RequestArguments): Promise<unknown> {
        return   await this.walletProvider.request(args)
    };

    async enable(): Promise<ProviderAccounts> {
        return this.walletProvider.request({method: 'eth_requestAccounts'}) // enable ethereum
    }

    async switchEthereumChain(chainId: string, rpcUrl?: string) {
        try {
            await this.walletProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId}]
            })
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await this.walletProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{chainId, rpcUrl}]
                    })
                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        }
    }


    async isMetamaskLock(): Promise<boolean> {
        return this.walletProvider._metamask.isUnlocked()
    }

    async onConnectMetaMask(): Promise<any> {
        // 请求会触发解锁窗口
        const accounts = await this.walletProvider.request({method: 'eth_requestAccounts'})
        const walletChainId = await this.walletProvider.request({method: 'eth_chainId'})
        console.log('wallet isConnected', this.walletProvider.isConnected())
        this.account = accounts[0]
        return accounts
    }


    async switchBSCTEST() {
        const rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545'
        await this.switchEthereumChain('0x61')
    }

    async switchBSC() {
        const rpcUrl = 'https://bsc-dataseed1.defibit.io/'
        await this.switchEthereumChain('0x38')
    }

    async switchRinkeby() {
        const rpcUrl = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
        await this.switchEthereumChain('0x4', rpcUrl)
    }
}


