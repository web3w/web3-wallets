export {MetaMaskWallet} from './src/connectors/metamaskWallet'
export {CoinbaseWallet} from './src/connectors/coinbaseWallet'
export {ConnectWallet} from './src/connectors/walletConnet'
export {Web3Wallets} from './src'

export type {
    LimitedCallSpec,
    WalletInfo,
    ChainConfig
} from './src/types'
export {TokenSchemaName, ProviderNames} from './src/types'

export type {
    EIP712TypedData,
    EIP712Types,
    EIP712TypedDataField,
    EIP712Domain,
    EIP712Message,
    EIP712MessageValue,
    ECSignature,
    Signature
} from "./src/signature/eip712TypeData"

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
    EIP712_DOMAIN_TYPEHASH,
    hexUtils, assert, schemas
} from "./src/signature/eip712TypeData"

export {get1559Fee} from './src/utils/fee'

export {
    ethSend, getEstimateGas, getChainRpcUrl, getChainInfo
} from './src/utils/rpc'
export type {TransactionRequest, TransactionResponse} from './src/utils/rpc'

export {getProvider, detectWallets} from './src/utils/provider'

export {
    CHAIN_NAME, CHAIN_CONFIG, NULL_ADDRESS, NULL_BLOCK_HASH, ETH_TOKEN_ADDRESS, MAX_UINT_256, BigNumber, ZERO
} from './src/constants'

export {ethers, Signer, Contract, Wallet, providers, BaseContract, constants, utils} from 'ethers'
export type {ContractInterface} from 'ethers'
