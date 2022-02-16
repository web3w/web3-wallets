const RPC_PROVIDER = {
    4: 'https://api-test.element.market/api/v1/jsonrpc',
    1: 'https://api.element.market/api/v1/jsonrpc',
    56: 'https://api.element.market/api/bsc/jsonrpc',
    97: 'https://api-test.element.market/api/bsc/jsonrpc',
    137: 'https://api.element.market/api/polygon/jsonrpc',
    80001: 'https://api-test.element.market/api/polygon/jsonrpc'
}

export class WalletConnect {
    constructor() {
        const wallet = new ConnectWallet()
        this.connector = wallet.connector
        this.wallet = wallet
    }
}



