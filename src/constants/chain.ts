export const CHAIN_NAME = {
    1: "ethereum",
    3: "ethereum_ropsten",
    4: "ethereum_rinkeby",
    56: "binance",
    97: "binance_test",
    128: "heco",
    137: "polygon",
    42161: "arbitrum",
    42220: "celo",
    43113: "avalanche_test",
    43114: "avalanche",
    80001: "polygon_mumbai",
};
export const CHAIN_CONFIG = {
    "1": {
        name: "Ethereum Mainnet",
        short_name: "eth",
        chain: "ETH",
        network: "mainnet",
        native_currency: {
            symbol: "ETH",
            name: "Ether",
            decimals: "18"
        },
        "rpcs": [
            "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            "https://api.mycryptoapi.com/eth",
            "https://rpc.flashbots.net/",
            "https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79",
            "https://cloudflare-eth.com/",
            "https://mainnet-nethermind.blockscout.com/",
            "https://nodes.mewapi.io/rpc/eth",
            "https://main-rpc.linkpool.io/",
            "https://mainnet.eth.cloud.ava.do/",
            "https://ethereumnodelight.app.runonflux.io",
            "https://rpc.ankr.com/eth",
            "https://eth-rpc.gateway.pokt.network",
            "https://main-light.eth.linkpool.io",
            "https://eth-mainnet.public.blastapi.io",
            "https://api.element.market/api/v1/jsonrpc"
        ]
    },
    "3": {
        name: "Ethereum Ropsten",
        native_currency: {
            symbol: "ETH",
            name: "Ether",
            decimals: "18"
        },
        "rpcs": [
            "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        ],
        "faucets": [
            "https://faucet.egorfine.com/"
        ],
        "scans": [
            "https://ropsten.etherscan.io/"
        ]
    },
    "4": {
        name: "Ethereum Rinkby",
        short_name: "eth",
        native_currency: {
            symbol: "ETH",
            name: "Ether",
            decimals: "18"
        },
        chain: "ETH",
        "rpcs": [
            "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            "https://api-test.element.market/api/v1/jsonrpc"
        ],
        "scans": [
            "https://rinkeby.etherscan.io/"
        ],
        "faucets": [
            "https://rinkebyfaucet.com/"
        ]
    },
    "56": {
        name: "BSC Chain",
        native_currency: {
            symbol: "BNB",
            name: "BNB",
            decimals: "18"
        },
        "rpcs": [
            "https://api.element.market/api/bsc/jsonrpc",
            "https://bsc-dataseed1.defibit.io/",
            "https://bsc-dataseed1.ninicoin.io/",
            "https://bsc-dataseed2.defibit.io/",
            "https://bsc-dataseed3.defibit.io/",
            "https://bsc-dataseed4.defibit.io/",
            "https://bsc-dataseed2.ninicoin.io/",
            "https://bsc-dataseed3.ninicoin.io/"
        ]
    },
    "97": {
        name: "BSC TEST Chain",
        native_currency: {
            symbol: "BNB",
            name: "BNB",
            decimals: "18"
        },
        "rpcs": [
            "https://data-seed-prebsc-1-s1.binance.org:8545",
            "https://api-test.element.market/api/bsc/jsonrpc"
        ],
        "scans": [
            "https://testnet.bscscan.com/"
        ],
        "faucets": [
            "https://testnet.binance.org/faucet-smart"
        ]
    },
    "43113": {
        native_currency: {
            symbol: "AVAX",
            name: "AVAX",
            decimals: "18"
        },
        "rpcs": [
            "https://api.avax-test.network/ext/bc/C/rpc",
            "https://api-test.element.market/api/avalanche/jsonrpc"
        ],
        "faucets": [
            "https://faucet.avax-test.network/"
        ],
        "scans": [
            "https://testnet.snowtrace.io/"
        ]
    },
    "43114": {
        native_currency: {
            symbol: "AVAX",
            name: "AVAX",
            decimals: "18"
        },
        "rpcs": [
            "https://api.avax.network/ext/bc/C/rpc",
            "https://rpc.ankr.com/avalanche",
            "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc"
        ],
        "scans": [
            "https://snowtrace.io/"
        ]
    },
    "137": {
        native_currency: {
            symbol: "MATIC",
            name: "MATIC",
            decimals: "18"
        },
        "rpcs": [
            "https://polygon-rpc.com",
            "https://rpc-mainnet.matic.network",
            "https://rpc-mainnet.maticvigil.com",
            "https://rpc-mainnet.matic.quiknode.pro",
            "https://matic-mainnet.chainstacklabs.com",
            "https://matic-mainnet-full-rpc.bwarelabs.com",
            "https://matic-mainnet-archive-rpc.bwarelabs.com",
            "https://poly-rpc.gateway.pokt.network/",
            "https://rpc.ankr.com/polygon",
            "https://rpc-mainnet.maticvigil.com/",
            "https://polygon-mainnet.public.blastapi.io"
        ],
        "scans": [
            "https://polygonscan.com/"
        ]
    },
    "80001": {
        native_currency: {
            symbol: "MATIC",
            name: "MATIC",
            decimals: "18"
        },
        "rpcs": [
            "https://matic-mumbai.chainstacklabs.com"
        ],
        "scans": [
            "https://mumbai.polygonscan.com/"
        ],
        "faucets": [
            "https://faucet.polygon.technology/"
        ]
    },
}


interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string; // 2-6 characters long
        decimals: 18;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[]; // Currently ignored.
}

export function addChainParameter(chainId: number): AddEthereumChainParameter {
    const rpcInfo = CHAIN_CONFIG[chainId]
    const rpcMap: AddEthereumChainParameter = {
        chainId: '0x' + Number(chainId).toString(16),
        chainName: CHAIN_NAME[chainId],
        nativeCurrency: rpcInfo.native_currency,
        rpcUrls: rpcInfo.rpcs,
        blockExplorerUrls: rpcInfo.scans,
    }
    return rpcMap
}

export function chainRpcMap(): { [chainId: number]: string } {
    const rpcMap: { [chainId: number]: string } = {}
    for (const chainId in CHAIN_CONFIG) {
        const rpcUrl = CHAIN_CONFIG[chainId].rpcs[0]
        if (rpcUrl && rpcUrl != "rpcWorking:false") {
            rpcMap[chainId] = CHAIN_CONFIG[chainId].rpcs[0]
        }
    }
    return rpcMap
}
