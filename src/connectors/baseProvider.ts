import {
    EIP1193Provider, NewAsset,
    ProviderAccounts, RequestArguments
} from '../types'
import EventEmitter from "events";
import {addChainParameter} from "../constants/chain";

// https://github.com/metamask/test-dapp
// https://metamask.github.io/test-dapp/

export abstract class BaseProvider extends EventEmitter implements EIP1193Provider {
    public address
    public accounts: string[] = []
    public chainId = 0
    public provider: any

    async request(args: RequestArguments) {
        return this.provider.request(args)
    };

    async connect(): Promise<ProviderAccounts> {
        const accounts = await this.provider.request({method: 'eth_requestAccounts'})
        const chainId = await this.provider.request({method: 'eth_chainId'})
        this.chainId = Number(chainId)
        this.address = accounts[0]
        this.accounts = accounts
        return accounts // enable ethereum
    }

    connected() {
        if (this.provider.isConnected) {
            return this.provider.isConnected()
        }

        if (this.provider.connected) {
            return this.provider.connected
        }
    }

    async disconnect() {
        this.chainId = 0
        this.accounts = []
        this.address = undefined
        if (this.provider.close) {
            return this.provider.close()
        }
        if (this.provider.disconnect) {
            return this.provider.disconnect()
        }
    }

    async addChainId(chainId: number) {
        const params = addChainParameter(chainId)
        this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
                params
            ],
        });
        this.chainId = chainId
    }

    async switchEthereumChain(chainId: number) {
        try {
            console.log("switchEthereumChain", '0x' + Number(chainId).toString(16))
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: '0x' + Number(chainId).toString(16)}]
            })

        } catch (switchError: any) {
            debugger
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                this.addChainId(chainId)
            }
        }
        this.chainId = chainId
    }

    async addToken(params: NewAsset) {
        this.provider.request({
            method: 'wallet_watchAsset',
            params
        }).then((success) => {
            if (success) {
                console.log('Asset successfully added to wallet!');
            } else {
                throw new Error('Something went wrong.');
            }
        }).catch(console.error);
    }

}
