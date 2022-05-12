export {MetaMaskWallet} from './src/connectors/metamaskWallet'
export {CoinbaseWallet} from './src/connectors/coinbaseWallet'
export {ConnectWallet} from './src/connectors/walletConnet'

export {Web3Wallets} from './src/index'

export {ProviderNames, RPC_PUB_PROVIDER, NULL_ADDRESS, NULL_BLOCK_HASH, ETH_TOKEN_ADDRESS} from './src/types'
export type {LimitedCallSpec, WalletInfo} from './src/types'

export {get1559Fee} from './src/utils/fee'
// RPC
export {ethSend, ethSendGas, ethSendGasLimit, getEstimateGas} from './src/utils/rpc'

export {getProvider, detectWallets} from './src/utils/provider'


export {ethers, Signer, Contract, Wallet, providers, BaseContract, constants} from 'ethers'
export type {ContractInterface} from 'ethers'

export type {
    ExAgent,
    Asset,
    ExchangeMetadata,
    Token,
    OfferType,
    MatchParams,
    BuyOrderParams,
    SellOrderParams,
    CreateOrderParams,
    LowerPriceOrderParams,
    AcceptOrderOption,
    BatchAcceptOrderOption
} from './src/agentTypes'

export {ElementSchemaName, BigNumber} from './src/agentTypes'
export {UserAccount} from './src/utils/userAccount'
