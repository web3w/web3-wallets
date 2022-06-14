# web3-wallets
Adapt to web3 wallet, unified interface.
```
                                    wallets          blockchains


                               ╭───[MetaMask]────────[EVM-blockchains]
                               │
                               ├───[WalletConnect]───[EVM-blockchains]
[your dapp]───[web3-wallets]───|
                               ├───[Coinbase]─────────[EVM-blockchains]
                               │
                               ├───[Coin98]─────[EVM-blockchains]
                               |
                               ╰───[Other]----[Other] #Todo

```

## Used `WalletNames`'s

type WalletNames = 'metamask' | 'coinbase' | 'imtoken' | 'math_wallet' | 'token_pocket' | 'wallet_connect' | '
bitkeep' | 'coin98'

```ts
const wallet = new Web3Wallets('metamask')
const accounts = await wallet.enable()
const res = await wallet.request({"method": "eth_blockNumber", "params": []})
```

## Detect Wallets

```ts
const wallets = detectWallets()
const walletList = Object.values(wallets)
```

## Get Provider

```ts
export interface WalletInfo {
    chainId: number
    address: string
    privateKeys?: string[]
    rpcUrl?: RpcInfo
    port?: number
    cacheExpiration?: number
    bridge?: string
    offsetGasLimitRatio?: number
    isSetGasPrice?: boolean
} 
const { address, chainId, rpcUrl, walletSigner,  walletProvider} = getProvider(walletInfo)

```
