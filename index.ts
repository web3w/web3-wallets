export {EthereumProvider} from './src/connectors/ethereumProvider'
export {CoinbaseProvider} from './src/connectors/coinbaseProvider'
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
    ethers,  Contract, Wallet, providers, BaseContract,
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
    getEIP712StructHash,
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
    sleep,
    checkURL,
    isCoinBase,
    isMetaMask,
    isBitKeep,
    isOneKey,
    isImToken,
    isMathWallet,
    isTokenPocket
} from './src/utils/hepler'

export {
    ethSend,
    getEstimateGas,
    getChainRpcUrl,
    getChainInfo
} from './src/utils/rpc'


export {getWalletInfo, getProvider, detectWallets, getWalletName} from './src/utils/provider'

export {
    CHAIN_NAME, CHAIN_CONFIG, NULL_ADDRESS, NULL_BLOCK_HASH, ETH_TOKEN_ADDRESS, MAX_UINT_256
} from './src/constants'

