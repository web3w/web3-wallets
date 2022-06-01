import {ethers, utils} from 'ethers'
import {EIP712Domain, getEIP712DomainHash, getEIP712Hash, hexUtils} from "../../src/signature/eip712TypeData";
import BigNumber from "bignumber.js";

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
        "Order": [
            {
                "name": "makerAddress",
                "type": "address"
            },
            {
                "name": "takerAddress",
                "type": "address"
            },
            {
                "name": "feeRecipientAddress",
                "type": "address"
            },
            {
                "name": "senderAddress",
                "type": "address"
            },
            {
                "name": "makerAssetAmount",
                "type": "uint256"
            },
            {
                "name": "takerAssetAmount",
                "type": "uint256"
            },
            {
                "name": "makerFee",
                "type": "uint256"
            },
            {
                "name": "takerFee",
                "type": "uint256"
            },
            {
                "name": "expirationTimeSeconds",
                "type": "uint256"
            },
            {
                "name": "salt",
                "type": "uint256"
            },
            {
                "name": "makerAssetData",
                "type": "bytes"
            },
            {
                "name": "takerAssetData",
                "type": "bytes"
            },
            {
                "name": "makerFeeAssetData",
                "type": "bytes"
            },
            {
                "name": "takerFeeAssetData",
                "type": "bytes"
            }
        ]
    },
    "domain": {
        "name": "0x Protocol",
        "version": "3.0.0",
        "chainId": 4,
        "verifyingContract": "0xf8becacec90bfc361c0a2c720839e08405a72f6d"
    },
    "message": {
        "makerAddress": "0x9F7A946d935c8Efc7A8329C0d894A69bA241345A",
        "makerAssetAmount": "19600000000000",
        "takerAssetAmount": "100",
        "makerAssetData": "0xf47261b0000000000000000000000000b506bfaa7661dabf4de80672bd3f13f4610a5fdf",
        "takerAssetData": "0xa7cb5fb7000000000000000000000000991a868aa7b0a9a24565ede2d8fe758874a6a217000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000",
        "makerFeeAssetData": "0xf47261b0000000000000000000000000b506bfaa7661dabf4de80672bd3f13f4610a5fdf",
        "takerFeeAssetData": "0x",
        "takerAddress": "0x0000000000000000000000000000000000000000",
        "senderAddress": "0x0000000000000000000000000000000000000000",
        "makerFee": "400000000000",
        "takerFee": "0",
        "feeRecipientAddress": "0xd4634Def693cBDC82FB8a097baaAB75A50252A51",
        "salt": "1766847064936806886651726866319818225702098055407751432033194186301846618",
        "expirationTimeSeconds": "1654613471",
        "exchangeAddress": "0xf8becacec90bfc361c0a2c720839e08405a72f6d",
        "chainId": 4
    },
    "primaryType": "Order"
}


const types = typedData.types
//00010000000062962b5f27109f7a946d935c8efc7a8329c0d894a69ba241345a
const salt = new BigNumber('1766847064936806886651726866319818225702098055407751432033194186301846618').toString(16)
console.log(salt)

// Recursively finds all the dependencies of a type
function dependencies(primaryType: string, found = []) {
    // @ts-ignore
    if (found.includes(primaryType)) {
        return found
    }
    // @ts-ignore
    if (types[primaryType] === undefined) {
        return found
    }
    // @ts-ignore
    found.push(primaryType)
    // @ts-ignore
    for (let field of types[primaryType]) {
        for (let dep of dependencies(field.type, found)) {
            if (!found.includes(dep)) {
                found.push(dep)
            }
        }
    }
    return found
}

function encodeType(primaryType: string) {
    // Get dependencies primary first, then alphabetical
    let deps = dependencies(primaryType)
    deps = deps.filter(t => t != primaryType)
    // @ts-ignore
    deps = [primaryType].concat(deps.sort())

    // Format as a string with fields
    let result = ''
    for (let type of deps) {
        // @ts-ignore
        result += `${type}(${types[type].map(({name, type}) => `${type} ${name}`).join(',')})`
    }
    return result
}

function typeHash(primaryType: string) {
    const str = encodeType(primaryType)
    return hexUtils.hash(str)
}

function encodeData(primaryType: string, data: any) {
    let encTypes: string[] = []
    let encValues: string[] = []

    // Add typehash
    encTypes.push('bytes32')
    encValues.push(typeHash(primaryType))
    // console.log(primaryType, typeHash(primaryType))

    // Add field contents
    // @ts-ignore
    for (let field of types[primaryType]) {
        let value = data[field.name]
        if (field.type == 'string' || field.type == 'bytes') {
            encTypes.push('bytes32')
            encValues.push(hexUtils.hash(value))
        } else { // @ts-ignore
            if (types[field.type] !== undefined) {
                encTypes.push('bytes32')
                const hash = hexUtils.hash(encodeData(field.type, value))
                encValues.push(hash)
            } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
                throw 'TODO: Arrays currently unimplemented in encodeData'
            } else {
                encTypes.push(field.type)
                encValues.push(value)
            }
        }
    }
    console.log(encTypes, encValues)
    return abiCoder.encode(encTypes, encValues)

}

function mySplit(str: string, leng: number) {
    let arr:string[] = [];
    let index = 0;
    while (index < str.length) {
        const end = index + leng
        arr.push(str.slice(index, end))
        index = end
    }
    console.log(arr);
}

function getStructHash(primaryType: string, data: any) {
    const strBuff = encodeData(primaryType, data)

    mySplit(strBuff.substring(2), 64)
    return hexUtils.hash(strBuff)
}


function signHash() {
    //domain  =
    // const buff2 = getStructHash('EIP712Domain', typedData.domain)
    const buff2 = "0x5da218a349374eec3a3f120b3ef60d67f49053325f2780e6e068591396d14db0"
    const buff3 = getStructHash(typedData.primaryType, typedData.message)
    const buffAll = hexUtils.concat(['0x1901', buff2, buff3])
    return hexUtils.hash(buffAll)
}

const successHash = "0x81127ae2359f698f8b27e31172e73dd2ba88c5e1e056985251075ec94ed145f2"
//0x20a92ab9a8c21bb464adf47af4d641be8efda957ce52981ae3deeec95446d509
const hash = signHash() //0x20a92ab9a8c21bb464adf47af4d641be8efda957ce52981ae3deeec95446d509
console.log("Sign Hash Right:", hash)
const hash1 = getEIP712Hash(typedData)
console.log("Sign Hash:", hash1)



