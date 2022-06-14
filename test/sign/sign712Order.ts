
import {
    getEIP712Hash, hexUtils,
} from "../../src/signature/eip712TypeData";

// const fooo = hexUtils.split("0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",32,true)
// console.log(fooo)

const foo = hexUtils.hash([])
// console.log(foo)
const typedData = {
    "types": {
        "EIP712Domain": [],
        "ERC721Order": [
            {
                "type": "uint8",
                "name": "direction"
            },
            {
                "type": "address",
                "name": "maker"
            },
            {
                "type": "address",
                "name": "taker"
            },
            {
                "type": "uint256",
                "name": "expiry"
            },
            {
                "type": "uint256",
                "name": "nonce"
            },
            {
                "type": "address",
                "name": "erc20Token"
            },
            {
                "type": "uint256",
                "name": "erc20TokenAmount"
            },
            {
                "type": "Fee[]",
                "name": "fees"
            },
            {
                "type": "address",
                "name": "erc721Token"
            },
            {
                "type": "uint256",
                "name": "erc721TokenId"
            },
            {
                "type": "Property[]",
                "name": "erc721TokenProperties"
            }
        ],
        "Fee": [
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "bytes",
                "name": "feeData"
            }
        ],
        "Property": [
            {
                "type": "address",
                "name": "propertyValidator"
            },
            {
                "type": "bytes",
                "name": "propertyData"
            }
        ]
    },
    "domain": {
        "chainId": 1,
        "verifyingContract": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
        "name": "ZeroEx",
        "version": "1.0.0"
    },
    "primaryType": "ERC721Order",
    "message": {
        "direction": 0,
        "maker": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "taker": "0x0000000000000000000000000000000000000000",
        "expiry": "86410",
        "nonce": "10",
        "erc20Token": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "erc20TokenAmount": "1",
        "fees": [],
        "erc721Token": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "erc721TokenId": "2",
        "erc721TokenProperties": []
    }
}


const hash1 = getEIP712Hash(typedData)
const orderHash = '0xfc61e1f209df8981854756c6377aae52cb7587f877f49fc6b5a9400c8af9e3fd'
console.assert(hash1==orderHash,"error")

