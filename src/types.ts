import { Web3Provider, JsonRpcSigner, ExternalProvider } from "@ethersproject/providers";
import { Signer } from 'ethers'

export { ethers, Contract, Wallet, BrowserProvider as providers, BaseContract } from 'ethers'
//  constants, utils
 
export type { ExternalProvider, Signer }
export { Web3Provider, JsonRpcSigner }


export type { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider'

export type { ContractInterface } from 'ethers'

export type TokenSchemaNames =
    'erc20'
    | 'erc721'
    | 'erc1155'
    | 'cryptokitties'
    | 'ensshortnameauction'
    | 'cryptopunks'

export type WalletNames = 'metamask'
    | 'coinbase'
    | 'imtoken'
    | 'math_wallet'
    | 'token_pocket'
    | 'wallet_connect'
    | 'onekey'
    | 'onto_wallet'
    | 'rainbow'
    | 'bitkeep'
    | 'finnie_wallet'
    | 'coin98'
    | 'tron_link'
    | 'wallet_signer'


export interface RpcInfo {
    url: string,
    headers?: { [key: string]: string | number }
    user?: string,
    password?: string,
    timeout?: number
}

export interface IQRCodeModal {
    open(uri: string, cb: any, opts?: any): void;

    close(): void;
}

export interface WalletInfo {
    chainId: number
    address: string
    name?: string
    privateKeys?: string[]
    rpcUrl?: RpcInfo
    port?: number
    cacheExpiration?: number
    bridge?: string
    offsetGasLimitRatio?: number
    isSetGasPrice?: boolean
    provider?: ExternalProvider
    qrcodeModal?: IQRCodeModal;
}


export interface LimitedCallSpec {
    to: string
    data: string
    value?: string
    from?: string
    gasLimit?: number
}

export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

export interface ProviderMessage {
    type: string;
    data: unknown;
}

export interface ProviderInfo {
    chainId: string;
}

export interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}

export type ProviderChainId = string;

export interface ProviderConnectInfo {
    readonly chainId: string
}

export type ProviderAccounts = string[];

export interface SimpleEventEmitter {
    // add listener
    on(event: string, listener: any): void;

    // add one-time listener
    once(event: string, listener: any): void;

    // remove listener
    removeListener(event: string, listener: any): void;

    // removeListener alias
    off(event: string, listener: any): void;
}

export interface EIP1193Provider extends SimpleEventEmitter {
    // connection event
    on(event: "connect", listener: (info: ProviderInfo) => void): void;

    // disconnection event
    on(event: "disconnect", listener: (error: ProviderRpcError) => void): void;

    // arbitrary messages
    on(event: "message", listener: (message: ProviderMessage) => void): void;

    // chain changed event
    on(event: "chainChanged", listener: (chainId: ProviderChainId) => void): void;

    // accounts changed event
    on(
        event: "accountsChanged",
        listener: (accounts: ProviderAccounts) => void
    ): void;

    // make an Ethereum RPC method call.
    request(args: RequestArguments): Promise<unknown>;
}

//
// export interface IEthereumProvider extends EIP1193Provider {
//     // legacy alias for EIP-1102
//     enable(): Promise<ProviderAccounts>;
// }


export interface ChainConfig {
    rpcs: string[]
    faucets?: string[]
    scans?: string[]
    name?: string
    websiteUrl?: string
    websiteDead?: boolean
    rpcWorking?: boolean
}


export interface JsonRpcError {
    id: number;
    jsonrpc: string;
    error: ErrorResponse;
}

export interface ErrorResponse {
    code: number;
    message: string;
    data?: string;
}

export interface JsonRpcResult<T = any> {
    id: number;
    jsonrpc: string;
    result: T;
}

export type JsonRpcResponse<T = any> = JsonRpcResult<T> | JsonRpcError;

export interface JsonRpcPayload {
    jsonrpc: string;
    method: string;
    params?: any[];
    id?: string | number;
}

export interface NewAsset {
    type: string,
    options: {
        address: string
        symbol: string
        decimals: number
        image?: string
    }
}

