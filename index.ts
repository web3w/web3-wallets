export {MetaMaskWallet} from './src/connectors/metamaskWallet'
export {CoinbaseWallet} from './src/connectors/coinbaseWallet'
export {ConnectWallet} from './src/connectors/walletConnet'

export {Web3Wallets} from './src/index'
export {CHAIN_NAME, CHAIN_CONFIG} from './src/constants/chain'

export {
    ProviderNames, NULL_ADDRESS, NULL_BLOCK_HASH, ETH_TOKEN_ADDRESS, MAX_UINT_256
} from './src/types'
export type {
    LimitedCallSpec,
    WalletInfo,
    ChainConfigType
} from './src/types'

export type {
    EIP712Domain,
    EIP712TypedData,
    EIP712Types,
    EIP712Object,
    EIP712ObjectValue,
    TypedDataDomain,
    TypedDataField,
} from "./src/utils/eip712TypeData"

export {hexUtils, createTypedData, getEIP712DomainHash, getEIP712Hash, getTypeHash} from "./src/utils/eip712TypeData"

export {get1559Fee} from './src/utils/fee'
// RPC
export {
    ethSend, getEstimateGas, getChainRpcUrl, getChainInfo
} from './src/utils/rpc'
export type {TransactionRequest, TransactionResponse} from './src/utils/rpc'

export {getProvider, detectWallets} from './src/utils/provider'

export {ethers, Signer, Contract, Wallet, providers, BaseContract, constants} from 'ethers'
export type {ContractInterface} from 'ethers'

export type {
    APIConfig,
    ExAgent,
    Asset,
    MetaAsset,
    ExchangeMetadata,
    Token,
    MixedPayment,
    MatchParams,
    BuyOrderParams,
    SellOrderParams,
    CreateOrderParams,
    LowerPriceOrderParams,
    AcceptOrderOption,
    BatchAcceptOrderOption
} from './src/agentTypes'

export {ElementSchemaName, BigNumber, ETHToken, NullToken, OrderType, OfferType} from './src/agentTypes'
export {
    UserAccount, assetToMetadata, metadataToAsset, tokenToAsset, tokenToMetadata, transactionToCallData
} from './src/utils/userAccount'
