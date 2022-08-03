import walletConnectIcon from "../assets/images/walletconnect.png";
import metamaskIcon from "../assets/images/metamask.png";
import coinbaseIcon from "../assets/images/coinbaseWallet.svg";
import oneKeyIcon from "../assets/images/onekey.svg";

export {walletConnectIcon, metamaskIcon, coinbaseIcon,oneKeyIcon}

export const RPC_PROVIDER = {
    4: 'https://api-test.element.market/api/v1/jsonrpc',
    1: 'https://api.element.market/api/v1/jsonrpc',
    56: 'https://api.element.market/api/bsc/jsonrpc',
    97: 'https://api-test.element.market/api/bsc/jsonrpc',
    137: 'https://api.element.market/api/polygon/jsonrpc',
    80001: 'https://api-test.element.market/api/polygon/jsonrpc'
}

// export const  bridge="https://element-api-test.eossql.com/bridge/walletconnect"
export const bridge = 'https://element-api.eossql.com/bridge/walletconnect'

export const msg712sign = {
    types: {
        EIP712Domain: [
            {name: 'name', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'},
        ],
        Person: [
            {name: 'name', type: 'string'},
            {name: 'wallet', type: 'address'},
        ],
        Mail: [
            {name: 'from', type: 'Person'},
            {name: 'to', type: 'Person'},
            {name: 'contents', type: 'string'},
        ],
    },
    primaryType: 'Mail',
    domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: '1',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    message: {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
    },
};


export const nftOrder = {
    types: {
        "NFTBuyOrder": [{"type": "address", "name": "maker"}, {
            "type": "address",
            "name": "taker"
        }, {"type": "uint256", "name": "expiry"},
            {"type": "uint256", "name": "nonce"}, {
                "type": "address",
                "name": "erc20Token"
            }, {"type": "uint256", "name": "erc20TokenAmount"}, {"type": "Fee[]", "name": "fees"}, {
                "type": "address",
                "name": "nft"
            }, {"type": "uint256", "name": "nftId"},{
                "type": "uint256",
                "name": "hashNonce"
            }],
        "Fee": [{"type": "address", "name": "recipient"}, {"type": "uint256", "name": "amount"}, {
            "type": "bytes",
            "name": "feeData"
        }],
        "EIP712Domain": [{"name": "name", "type": "string"}, {"name": "version", "type": "string"}, {
            "name": "chainId",
            "type": "uint256"
        }, {"name": "verifyingContract", "type": "address"}]
    },
    domain: {
        "name": "ElementEx",
        "version": "1.0.0",
        "chainId": "4",
        "verifyingContract": "0x8d6022b8a421b08e9e4cef45e46f1c83c85d402f"
    },
    primaryType: "NFTBuyOrder",
    message: {
        "maker": "0x32f4b63a46c1d12ad82cabc778d75abf9889821a",
        "taker": "0x0000000000000000000000000000000000000000",
        "expiry": "7124974317609481036",
        "nonce": "10",
        "erc20Token": "0xc778417e063141139fce010982780140aa0cd5ab",
        "erc20TokenAmount": "950000000000000",
        "fees": [],
        "nft": "0x3b06635c6429d0ffcbe3798b860d065118269cb7",
        "nftId": "73",
        "hashNonce": "0"
    }
}



