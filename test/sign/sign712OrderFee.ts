
import {
    getEIP712Hash,
} from "../../src/signature/eip712TypeData";

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
        "chainId": 4,
        "verifyingContract": "0x18f256732A5c980E450b2b8c32ad2F12ca2442f8",
        "name": "ZeroEx",
        "version": "1.0.0"
    },
    "primaryType": "ERC721Order",
    "message": {
        "direction": 0,
        "maker": "0x9F7A946d935c8Efc7A8329C0d894A69bA241345A",
        "taker": "0x0000000000000000000000000000000000000000",
        "expiry": "86410",
        "nonce": "10",
        "erc20Token": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "erc20TokenAmount": "100000000000000000000",
        "fees": [],
        "erc721Token": "0x9F7A946d935c8Efc7A8329C0d894A69bA241345A",
        "erc721TokenId": "2",
        "erc721TokenProperties": []
    }
}


const hash1 = getEIP712Hash(typedData)
console.log(hash1)
// Sign Hash 0x90d2fa3eac54c631095fd1b46d821ad7729c29cbcd1194a0e29c8e05c780717b
// 0x4b46f2e388b831bcafa1f0af591fa38fdece345ad837870c3a1e32ff76c09388
