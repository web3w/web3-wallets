import {
    ProviderAccounts, RequestArguments, WalletInfo
} from '../types'
import {BaseWallet} from "./baseWallet";
import {createProvider} from "../utils/provider";
import {privateKeyToAddress} from "../signature/eip712TypeData";

import {ethers} from "ethers";


const getIPAdress = () => {
    let interfaces = require('os').networkInterfaces()
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address
            }
        }
    }
}


export class ProxyWallet extends BaseWallet {
    address = ""
    walletName = ""
    chainId = 0
    port = 8545
    provider: any

    constructor(wallet: WalletInfo) {
        super()
        const {priKey, chainId, address} = wallet
        this.address = address
        this.chainId = chainId
        if (priKey) {
            if (privateKeyToAddress(priKey).toLowerCase() != address.toLowerCase()) throw new Error("PriKey must have")
        }
        this.provider = createProvider(wallet)
    }

    async request(args: RequestArguments) {
        debugger
        const ip = "127.0.0.1";
        const url = `http://${ip}:${this.port}/`
        return ethers.utils.fetchJson(url, JSON.stringify(args))
    };

    //ProviderAccounts
    async enable(): Promise<ProviderAccounts> {
        try {
            const ip = "127.0.0.1";
            console.log(`${ip}:${this.port}`)
            await this.provider.listen(this.port, ip)
        } catch (err) {
            this.provider.log.error(err)
            process.exit(1)
        }
        return Promise.resolve([this.address])
    }
}

