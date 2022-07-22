import {addChainParameter} from '../constants/chain';
import {
    WalletNames,
    ProviderConnectInfo,
    ProviderMessage,
    ProviderRpcError, RequestArguments, ProviderAccounts,
} from '../types'
import {BaseWallet} from "./baseWallet";


// https://github.com/metamask/test-dapp
// https://metamask.github.io/test-dapp/
export class MetaMaskWallet extends BaseWallet {
    public walletName: WalletNames = 'metamask'
    public provider: any
    public chainId: number
    public address: string

    constructor() {
        super()
        this.provider = window.ethereum
        if (this.provider) {
            if (this.provider.overrideIsMetaMask) {
                this.provider = this.provider.providers.find(val => val.isMetaMask)
            }
            this.chainId = Number(this.provider.networkVersion)
            this.address = this.provider.selectedAddress
        } else {
            throw new Error('Please install wallet')
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

        // Events
        provider.on('connect', (connectInfo: ProviderConnectInfo) => {
            // console.log('Matemask connect', connectInfo)
            this.emit('connect', connectInfo)
            this.chainId = 0
            this.address = ''
        })

        provider.on('disconnect', (error: ProviderRpcError) => {
            // console.log('Matemask disconnect', error)
            this.emit('disconnect', error)
            this.provider = undefined
            this.chainId = 0
            this.address = ''
        })

        provider.on('chainChanged', async (walletChainId: string) => {
            // console.log('Matemask chainChanged', walletChainId)
            this.emit('disconnect', walletChainId)
            // window.location.reload()
        })

        provider.on('accountsChanged', async (accounts: Array<string>) => {
            // console.log('Matemask accountsChanged', accounts)
            this.emit('accountsChanged', accounts)
        })

        //eth_subscription
        provider.on('message', (payload: ProviderMessage) => {
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

    async enable(): Promise<ProviderAccounts> {
        return this.provider.request({method: 'eth_requestAccounts'}) // enable ethereum
    }

    private async addEthereumChain(params) {
        try {
            await this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    params
                ],
            });
        } catch (addError) {
            // handle "add" error
        }
    }

    public async addChainId(chainId: number) {
        const params = addChainParameter(chainId)
        this.addEthereumChain(params)
    }

    private async switchEthereumChain(chainId: string, rpcUrl?: string) {
        try {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId}]
            })
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await this.provider.request({
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
        return this.provider._metamask.isUnlocked()
    }

    async onConnectMetaMask(): Promise<any> {
        // 请求会触发解锁窗口
        const accounts = await this.provider.request({method: 'eth_requestAccounts'})
        const walletChainId = await this.provider.request({method: 'eth_chainId'})
        console.log('wallet isConnected', this.provider.isConnected())
        this.address = accounts[0]
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

    async addToken(params) {
        this.provider.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
                    symbol: 'FOO',
                    decimals: 18,
                    image: 'https://foo.io/token-image.svg',
                },
            },
        })
            .then((success) => {
                if (success) {
                    console.log('FOO successfully added to wallet!');
                } else {
                    throw new Error('Something went wrong.');
                }
            })
            .catch(console.error);
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


