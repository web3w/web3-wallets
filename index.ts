export {MetaMaskWallet} from './src/connectors/metamaskWallet'
export {CoinbaseWallet} from './src/connectors/coinbaseWallet'
export {Web3Wallets} from './src'

export type {
    LimitedCallSpec,
    WalletInfo,
    ChainConfig,
    RpcInfo,
    TokenSchemaNames,
    WalletNames,
    ContractInterface,
    TransactionRequest,
    TransactionResponse,
    ExternalProvider
} from './src/types'

export {
    ethers, Signer, Contract, Wallet, providers, BaseContract, constants, utils,
    Web3Provider,
    JsonRpcSigner,
} from './src/types'

export type {
    EIP712TypedData,
    EIP712Types,
    EIP712TypedDataField,
    EIP712Domain,
    EIP712Message,
    EIP712MessageValue,
    ECSignature,
    Signature
} from "./src/utils/eip712TypeData"

export {
    createEIP712TypedData,
    getEIP712Hash,
    getEIP712TypeHash,
    getEIP712DomainHash,
    signMessage,
    ecSignMessage,
    ecSignHash,
    joinECSignature,
    splitECSignature,
    privateKeyToAddress,
    privateKeysToAddress,
    EIP712_DOMAIN_TYPEHASH
} from "./src/utils/eip712TypeData"

export {hexUtils} from "./src/utils/hexUtils"

export {
    objectClone,
    itemsIsEquality,
    fetchJson,
    fetch,
    sleep,
    checkURL
} from './src/utils/hepler'

export {
    ethSend, getEstimateGas, getChainRpcUrl, getChainInfo, getTransactionReceipt, getBlockByNumber, getTransactionByHash
} from './src/utils/rpc'


export {getWalletInfo, getProvider, detectWallets} from './src/utils/provider'

export {
    CHAIN_NAME, CHAIN_CONFIG, NULL_ADDRESS, NULL_BLOCK_HASH, ETH_TOKEN_ADDRESS, MAX_UINT_256, BigNumber, ZERO
} from './src/constants'

