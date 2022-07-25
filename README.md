# web3-wallets

Adapt to web3 wallet, unified interface.

Example: https://web3w.github.io/web3-wallets

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

## Used `WalletNames`

### An adapted wallet

'metamask','wallet_connect','coinbase','imtoken','math_wallet','token_pocket','bitkeep' | 'coin98'
  
#### Web3Js

```ts
const wallet = new Web3Wallets({name: 'metamask'})
const web3 = new Web3(wallet)
const sign = await web3.eth.personal.sign("hello web3", wallet.address)
```

#### Ethers

```ts
const wallet = new Web3Wallets({name: 'metamask'})
const provider = new ethers.providers.Web3Provider(wallet)
const signer = provider.getSigner()
const sign = await signer.signMessage("hello web3")
```

#### Connect
```ts
const accounts = await wallet.connect() // same enable()
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

const {address, chainId, rpcUrl, walletSigner, walletProvider} = getProvider(walletInfo)

```

## Signature

### signMessage

### signTypeData

```ts

const DOMAIN_DEFAULT = {
    name: 'ZeroEx',
    chainId: 1,
    verifyingContract: '0x0000000000000000000000000000000000000000',
    version: '1.0.0',
};
const zeroHash = getEIP712DomainHash(DOMAIN_DEFAULT)
const zero = "0xc92fa40dbe33b59738624b1b4ec40b30ff52e4da223f68018a7e0667ffc0e798"
console.assert(zeroHash == zero)

function getEIP712StructHash(typedData

.
primaryType, EIP_712_ORDER_TYPE, typedData.message
)

function getEIP712Hash(typeData: EIP712TypedData): string

```

### ecSignMessage

### ecSignHash

### hexUtils

## Chain Info

```ts
//
function getChainInfo(chinaId: number): ChainConfig

//
async function getChainRpcUrl(chinaId: number, best?: true): Promise<string>

```

### RPC

```ts
    const response = await fetchJson(url, {timeout: 10000, proxyUrl: 'http://127.0.0.1:7890'})
if (response.ok) {
    console.log(await response.json())
} else {
    console.log(response)
}
```
