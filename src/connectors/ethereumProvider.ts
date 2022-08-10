import {
    WalletNames,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError
} from '../types'
import {BaseProvider} from "./baseProvider";


function getProvider(name: WalletNames) {
    const provider = window && window.ethereum;
    if (name == 'metamask') {
        window.open('https://metamask.io/download/');
    }
    if (name == 'bitkeep') {
        window.open('https://bitkeep.com/download?type=0&theme=light');
    }

    if (name == 'onekey') {
        window.open('https://onekey.so/download/?client=browserExtension');
    }
    return provider;
}

// https://github.com/metamask/test-dapp
// https://metamask.github.io/test-dapp/
export class EthereumProvider extends BaseProvider {
    public walletName: WalletNames = 'metamask'
    public provider: any
    public chainId: number
    public address: string
    public accounts: string[] = []

    constructor(name?: WalletNames) {
        super()
        this.provider = getProvider(name || this.walletName)
        if (this.provider) {
            if (this.provider.overrideIsMetaMask) {
                const provider = this.provider.providerMap.get("MetaMask")
                this.provider = provider
            }
            this.chainId = Number(this.provider.networkVersion)
            this.address = this.provider.selectedAddress
            this.accounts = [this.address]
        } else {
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
        if (name == "bitkeep" && window.bitkeep) {
            // @ts-ignore
            this.provider = window.bitkeep.ethereum;
            this.walletName = 'bitkeep'
            //isBitKeep
            //isBitEthereum: true
            //isBitKeepChrome: true
        }
        // @ts-ignore
        if (name == "onekey" && window.$onekey) {
            // @ts-ignore
            this.provider = window.$onekey.ethereum
            this.walletName = 'onekey'
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


