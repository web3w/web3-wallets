import {
    getEIP712Hash
} from "../../src/utils/eip712TypeData";

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
        "fees": [
            {
                "recipient": "0x7538262Ae993ca117A0e481f908209137A46268e",
                "amount": "1000000000000",
                "feeData": "0x23"
            }
        ],
        "erc721Token": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "erc721TokenId": "2",
        "erc721TokenProperties": []
    }
}

const hash1 = getEIP712Hash(typedData)
const orderHash = '0xa4f5c10ad058390a875d9a723a21ba44a1b99a8a6395c2f1406f3af95e53e781'
console.assert(hash1 == orderHash, "error")

// EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)
// 0x7a7569e89575b3031dc2d03d45853a2c84dd95c5ed4e3d82ab958bf156ec969f
// ZeroEx
// 1.0.0
