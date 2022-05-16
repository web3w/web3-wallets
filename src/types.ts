export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const NULL_BLOCK_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const ETH_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"//0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
export const MAX_UINT_256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935' //new BigNumber(2).pow(256).minus(1).toString()


export const RPC_PUB_PROVIDER = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    3: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed1.defibit.io/',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    137: 'https://rpc-mainnet.maticvigil.com',
    80001: 'https://matic-mumbai.chainstacklabs.com',
    43113: "https://api.avax-test.network/ext/bc/C/rpc",
    43114: "https://api.avax.network/ext/bc/C/rpc"
}

export enum ProviderNames {
    Metamask = 'MetaMask',
    Coinbase = 'Coinbase',
    ImToken = 'ImToken',
    MathWallet = 'MathWallet',
    TokenPocket = 'TokenPocket',
    WalletConnect = 'WalletConnect',
    ProxyWallet = 'ProxyWallet',
    KeyStroeWallet = 'KeyStroe'
}

export interface WalletInfo {
    chainId: number
    address: string
    priKey?: string
    rpcUrl?: string
    offsetGasLimitRatio?: number
    isSetGasPrice?: boolean
}


export interface LimitedCallSpec {
    to: string
    data: string
    value?: string
    from?: string
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

interface EthSubscription extends ProviderMessage {
    readonly type: 'eth_subscription';
    readonly data: {
        readonly subscription: string;
        readonly result: unknown;
    };
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

export interface EIP1102Request extends RequestArguments {
    method: "eth_requestAccounts";
}

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

export interface IEthereumProvider extends EIP1193Provider {
    // legacy alias for EIP-1102
    enable(): Promise<ProviderAccounts>;
}
