import {
    IEthereumProvider, ProviderAccounts, RequestArguments, WalletNames
} from '../types'
import EventEmitter from "events";

// https://github.com/metamask/test-dapp
// https://metamask.github.io/test-dapp/

export abstract class BaseWallet extends EventEmitter implements IEthereumProvider {
    public address
    public chainId = 0
    public provider: any

    async request(args: RequestArguments) {
        return this.provider.request(args)
    };

    async enable(): Promise<ProviderAccounts> {
        return this.provider.request({method: 'eth_requestAccounts'}) // enable ethereum
    }
}
