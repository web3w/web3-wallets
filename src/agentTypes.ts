// import {Token, Asset, OrderType} from "./elementTypes";
import EventEmitter from 'events'
import {WalletInfo, NULL_ADDRESS, LimitedCallSpec, ETH_TOKEN_ADDRESS} from "./types";

export {BigNumber} from "./utils/bignumber"


// export interface ElementConfig {
//     chainId?: number;
//     account?: string
//     authToken?: string
//     apiBaseUrl?: string
//     protocolFeePoint?: number
//     protocolFeeAddress?: string
//     contractAddresses?: any
// }

export interface APIConfig {
    chainId?: number;
    account?: string
    authToken?: string
    apiBaseUrl?: string
    apiKey?: string
    apiTimeout?: number
    proxyUrl?: string
    protocolFeePoint?: number
    protocolFeeAddress?: string
    contractAddresses?: any
}

export enum ElementSchemaName {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
    CryptoKitties = 'CryptoKitties',
    ENSShortNameAuction = 'ENSShortNameAuction'
    // LegacyEnjin = 'Enjin',
    // CryptoPunks = 'CryptoPunks'
}

export interface Asset {
    // The asset's token ID, or null if ERC-20
    tokenId: string | undefined
    // The asset's contract address
    tokenAddress: string
    // The Element schema name (e.g. "ERC721") for this asset
    schemaName: ElementSchemaName
    // Optional for ENS names
    name?: string
    data?: string
    // Optional for fungible items
    decimals?: number
    chainId?: number
    collection?: any
}

interface NFTAsset {
    id: string
    address: string
    quantity?: string
    data?: string
}

interface FTAsset {
    id?: string
    address: string
    quantity: string
    data?: string
}

export type MetaAsset = NFTAsset | FTAsset

export interface ExchangeMetadata {
    asset: MetaAsset
    schema: ElementSchemaName
    version?: number
    referrerAddress?: string
}

export interface Token {
    name: string
    symbol: string
    address: string
    decimals: number
}

export const ETHToken: Token = {
    name: 'etherem',
    symbol: 'ETH',
    address: ETH_TOKEN_ADDRESS,
    decimals: 18
}

export const NullToken: Token = {
    name: 'etherem',
    symbol: 'ETH',
    address: NULL_ADDRESS,
    decimals: 18
}

export enum OrderType {
    All = -1,
    Buy = 0,
    Sell = 1
}

export interface MixedPayment {
    ethValue: string,
    wethValue: string
}

export type MatchParams = {
    orderStr: string;
    takerAmount?: string
    makerAddress?: string
    assetRecipientAddress?: string
    metadata?: string
    standard?: string
}

export interface CreateOrderParams {
    asset: Asset
    quantity: number
    paymentToken: Token
    startAmount: number
    expirationTime: number
    protocolFeePoint?: number
    protocolFeeAddress?: string
    standard?: string
    nonce?: number
    accountAddress?: string
}

export interface SellOrderParams extends CreateOrderParams {
    listingTime?: number
    endAmount?: number
    buyerAddress?: string
    englishAuctionReservePrice?: number
}

// export interface EnglishAuctionOrderParams extends CreateOrderParams {
//     englishAuctionReservePrice?: number
// }

export enum OfferType {
    ItemOffer = 'item_offer',
    ContractOffer = 'contract_offer'
}

export interface BuyOrderParams extends CreateOrderParams {
    askOrderStr?: string // best ask
    offerType?: OfferType
}

export interface LowerPriceOrderParams {
    orderStr: string
    basePrice: string
    royaltyFeePoint: number
    royaltyFeeAddress: string
    standard: string
    paymentToken?: Token
    protocolFeePoint?: number
    protocolFeeAddress?: string
    nonce?: number
    accountAddress?: string
}

export interface AcceptOrderOption {
    metadata?: string
    takerAmount?: string
    taker?: string
    standard?: string
    mixedPayment?: MixedPayment
    sellTokenId?: string
}

export interface BatchAcceptOrderOption {
    metadatas?: string[],
    takerAmounts?: string[],
    takers?: string[],
    standard?: string;
    mixedPayment?: MixedPayment
}


export interface ExAgent extends EventEmitter {
    contracts: any
    walletInfo: WalletInfo
    getAssetApprove: (metadatas: ExchangeMetadata[], decimals?: number) => Promise<{ isApprove: boolean, balances: string, calldata: LimitedCallSpec | undefined }[]>
    getOrderApproveStep: (params: CreateOrderParams, side: OrderType) => Promise<any>
    getMatchCallData: (params: MatchParams) => Promise<any>
    createSellOrder: (order: SellOrderParams) => Promise<any>
    createLowerPriceOrder: (order: LowerPriceOrderParams) => Promise<any>
    createBuyOrder: (order: BuyOrderParams) => Promise<any>
    acceptOrder: (order: string, option?: AcceptOrderOption) => Promise<any>
    cancelOrders: (orders: string[]) => Promise<any>
    getRegisterProxy?: () => Promise<{ isRegister: boolean, accountProxy: string, calldata: LimitedCallSpec | undefined }>
    acceptOrders?: (orders: string[], option?: BatchAcceptOrderOption) => Promise<any>
    // approveOrder?: (error: any) => Promise<any>
    checkOrderMatch?: (order: string, params?: MatchParams) => Promise<any>
    checkOrderPost?: (order: string, params?: MatchParams) => Promise<any>
}

// export enum CHAIN_ID {
//     main = 1,
//     ropsten = 3,
//     // [Network.Rinkeby]: 4,
//     // [Network.Kovan]: 42,
//     // [Network.BSC]: 56,
//     // [Network.BSCTEST]: 97,
//     // [Network.Polygon]: 137,
//     // [Network.Mumbai]: 80001,
//     // [Network.AvaxTest]: 43113,
//     // [Network.Avalanche]: 43114,
//     // [Network.Fantom]: 250,
//     // [Network.Celo]: 42220,
//     // [Network.Optimism]: 10
// }


