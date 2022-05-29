import * as ethUtil from 'ethereumjs-util'
import {ethers, utils} from 'ethers'
import {getStructHash} from "../../src/utils/eip712TypeData";

const abiCoder = new utils.AbiCoder()
const typedData = {
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
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
        "erc20Token": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "erc20TokenAmount": "1",
        "fees": [],
        "erc721Token": "0x9F7A946d935c8Efc7A8329C0d894A69bA241345A",
        "erc721TokenId": "2",
        "erc721TokenProperties": []
    }
}


const types = typedData.types



function signHash() {
    const buff1 = ethers.utils.hexValue('0x1901')
    const buff2 = getStructHash('EIP712Domain',typedData.types.EIP712Domain, typedData.domain)
    const buff3 = structHash(typedData.primaryType, typedData.message)
    const buffAll = ethers.utils.concat([buff1, buff2, buff3])
    return ethers.utils.keccak256(buffAll)
}

const privateKey = ethUtil.keccakFromString('cow')
const privateKeyS = ethers.utils.keccak256(Buffer.from('cow'))
console.log(ethers.utils.hexValue(privateKey))

const buff = ethUtil.keccak256(Buffer.from('cow'))
console.log(ethers.utils.hexValue(privateKey))


//0x20a92ab9a8c21bb464adf47af4d641be8efda957ce52981ae3deeec95446d509
const hash =signHash()
console.log(hash)
// console.log(ethers.utils.hexValue(signHash()))

const address = ethUtil.privateToAddress(privateKey)
const sig = ethUtil.ecsign(ethUtil.toBuffer(hash), privateKey)

//0xd551782de37f6a3b23c3bb8b0c75c8ebacd5043d6ecd4ea1eaa17a5f9087c818
console.log(ethers.utils.hexValue(sig.r))
