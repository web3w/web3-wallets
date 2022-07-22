// TypeScript
import {ProviderAccounts, WalletNames, RequestArguments} from '../types'
import {BaseProvider} from "./baseProvider";

declare global {
    interface Window {
        tronWeb: any
    }
}
const tronWalletEvent = (account) => {
    window.addEventListener('message', (res) => {
        if (res.data.message && res.data.message.action == "setAccount") {
            if (window.tronWeb) {
                if (res.data.message.data.address != account) {
                    window.location.reload();
                }
            } else {
                window.location.reload();
            }
        }
        if (res.data.message && res.data.message.action == "setNode") {
            window.location.reload();
        }
    });
}

export class TronLinkWallet  extends BaseProvider {
    public walletName: WalletNames = 'tron_link'
    public provider: any
    public address: string = ''
    public chainId: number = 0
    public host: string = ''


    constructor() {
        super()
        this.provider = window.tronWeb
        this.address = this.provider.defaultAddress.base58 || ''
        this.host = this.provider.fullNode.host
    }

    async request(args: RequestArguments): Promise<unknown> {
        return new Promise<unknown>(async (resolve, reject) => {
            const result = await this.provider.request(args)
            resolve(result)
        })
    };

    async connect(): Promise<ProviderAccounts> {
        tronWalletEvent(this.address)
        return this.provider.request({method: 'tron_requestAccounts'}) // enable ethereum

    }
}
