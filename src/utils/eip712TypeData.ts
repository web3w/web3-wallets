import {ethers, utils} from "ethers";
import {hexUtils} from "./hexUtils";
import {objectClone} from "./hepler";
import {Web3Assert, web3BaseAssert} from "web3-assert";
import {_TypedDataEncoder as TypedDataEncoder, id} from "@ethersproject/hash";
import {computePublicKey} from "@ethersproject/signing-key";
import {arrayify, hexDataSlice, hexZeroPad, joinSignature, splitSignature} from "@ethersproject/bytes";
import {keccak256} from "@ethersproject/keccak256";
import {ec as EC} from "elliptic";

// const abiCoder = new AbiCoder()

const assert = new Web3Assert().getValidator()

export interface ECSignature {
    v: number;
    r: string;
    s: string;
}

export interface Signature extends ECSignature {
    signatureType: number;
}

//TypedDataField
export interface EIP712TypedDataField {
    name: string;
    type: string;
};

export interface EIP712Types {
    [key: string]: EIP712TypedDataField[];
}

export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}

export type EIP712MessageValue = string | number | unknown[] | EIP712Message;

export interface EIP712Message {
    [key: string]: EIP712MessageValue;
}

export interface EIP712TypedData {
    types: EIP712Types
    domain: EIP712Domain
    message: EIP712Message
    primaryType: string
}

export function createEIP712TypedData(
    primaryType: string,
    types: EIP712Types,
    message: EIP712Message,
    domain: EIP712Domain
): EIP712TypedData {
    web3BaseAssert.isETHAddress({value: domain.verifyingContract, variableName: 'verifyingContract'})
    web3BaseAssert.isString({value: primaryType, variableName: 'primaryType'})
    assert.eip712DomainSchema(domain)
    const typedData = {
        types: {
            EIP712Domain: [
                {name: 'name', type: 'string'},
                {name: 'version', type: 'string'},
                {name: 'chainId', type: 'uint256'},
                {name: 'verifyingContract', type: 'address'}
            ],
            ...types
        },
        domain: {
            name: domain.name,
            version: domain.version,
            chainId: domain.chainId,
            verifyingContract: domain.verifyingContract
        },
        message,
        primaryType
    }
    assert.eip712TypedDataSchema(typedData)
    return typedData
}


export function joinECSignature(sign: ECSignature) {
    return sign.r + hexUtils.toHex(sign.s, false) + hexUtils.toHex(sign.v, false)
}

export function splitECSignature(signature: string): ECSignature {
    const sign = ethers.utils.splitSignature(signature)
    return {
        r: sign.r,
        s: sign.s,
        v: sign.v
    }
}


export function ecSignHash(hash: string, privateKey: string): ECSignature {
    if (!hexUtils.isHex(hash, 32)) throw new Error('Message not hex')
    if (!hexUtils.isHex(privateKey, 32)) throw new Error("Private key error")
    const curve = new EC("secp256k1");
    const keyPair = curve.keyFromPrivate(arrayify(privateKey));
    const digestBytes = arrayify(hash);
    if (digestBytes.length !== 32) {
        // logger.throwArgumentError("bad digest length", "digest", digest);
    }
    const signature = keyPair.sign(digestBytes, {canonical: true});
    const sign = splitSignature({
        recoveryParam: signature.recoveryParam,
        r: hexZeroPad("0x" + signature.r.toString(16), 32),
        s: hexZeroPad("0x" + signature.s.toString(16), 32),
    })

    // return joinSignature(vrs)

    // const ecSign = new ethers.Wallet(privateKey)
    // const sign = ecSign._signingKey().signDigest(hash)
    return {
        r: sign.r,
        s: sign.s,
        v: sign.v
    }
}

export function ecSignMessage(message: string, privateKey: string): ECSignature {
    const hash = hexUtils.hash(message);
    if (!hexUtils.isHex(privateKey, 32)) throw new Error("Private key error")
    return ecSignHash(hash, privateKey)
}

export function signMessage(message: string, privateKey: string): ECSignature {
    const hash = hexUtils.hashMessage(message)
    if (!hexUtils.isHex(privateKey, 32)) throw new Error("Private key error")
    const ecSign = new ethers.Wallet(privateKey)
    const sign = ecSign._signingKey().signDigest(hash)
    //sign.r + hexUtils.toHex(sign.s, false) + hexUtils.toHex(sign.v, false)
    return {
        r: sign.r,
        s: sign.s,
        v: sign.v
    }
}

export function signTypedData(typedData: EIP712TypedData, privateKey: string): ECSignature {
    const hash = getEIP712Hash(typedData)
    return ecSignHash(hash, privateKey)
}

// export const EIP712_DOMAIN_TYPEHASH = hexUtils.hash("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
export const EIP712_DOMAIN_TYPEHASH = "0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f"

/**
 * Get the hash of the EIP712 domain.
 */
export function getEIP712DomainHash(eip712Domain: EIP712Domain, domainTypeHash = EIP712_DOMAIN_TYPEHASH): string {
    let domainHex: string[] = [domainTypeHash]
    if (eip712Domain.name) {
        // console.log(domain.name)
        domainHex.push(hexUtils.hash(eip712Domain.name))
    }

    if (eip712Domain.version) {
        // console.log(domain.version)
        domainHex.push(hexUtils.hash(eip712Domain.version))
    }

    if (eip712Domain.chainId) {
        // console.log(domain.chainId)
        domainHex.push(hexUtils.leftPad(Number(eip712Domain.chainId)))
    }
    if (eip712Domain.verifyingContract) {
        // console.log(eip712Domain.verifyingContract)
        domainHex.push(hexUtils.leftPad(eip712Domain.verifyingContract))
    }
    return hexUtils.hash(hexUtils.concat(domainHex));
}


export function getEIP712TypeHash(
    primaryType: string,
    primaryStructAbi: EIP712TypedDataField[],
    referencedStructs: EIP712Types = {},) {
    const typeData = {[primaryType]: primaryStructAbi, ...referencedStructs}
    const typeName = TypedDataEncoder.from(typeData).encodeType(primaryType)
    return id(typeName)
}

/**
 * Compute a complete EIP712 hash given a struct hash.
 */
export function getEIP712Hash(typeData: EIP712TypedData): string {
    const types = objectClone(typeData.types)
    if (types.EIP712Domain) {
        delete types.EIP712Domain
    }
    return TypedDataEncoder.hash(typeData.domain, types, typeData.message)
}


//-------------- get type Hash -----------------
// function encodeType(structName: string, abi: EIP712TypedDataField[]): string {
//     return [`${structName}(`, abi.map(a => `${a.type} ${a.name}`).join(','), ')'].join('');
// }
//
// /**
//  * Compute the type hash of an EIP712 struct given its ABI.
//  */
// export function getEIP712TypeHash1(
//     primaryStructName: string,
//     primaryStructAbi: EIP712TypedDataField[],
//     referencedStructs: EIP712Types = {},
// ): string {
//     const primaryStructType = encodeType(primaryStructName, primaryStructAbi);
//     // Referenced structs are sorted lexicographically
//     // @ts-ignore
//     const referencedStructTypes = Object.entries(referencedStructs)
//         .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
//         .map(([name, abi]) => encodeType(name, abi));
//     // console.log(referencedStructTypes)
//     return hexUtils.hash(primaryStructType + referencedStructTypes.join(''));
// }

/**
 * Compute a complete EIP712 hash given a struct hash.
 */

// function encodeDataRefer(primaryType, types, values) {
//     let hashValues: string[] = []
//     for (let message of values) {
//         let encTypes: string[] = []
//         let encValues: string[] = []
//         encTypes.push('bytes32')
//         encValues.push(getEIP712TypeHash(primaryType, types))
//         for (let field of types) {
//             let value = message[field.name] as any
//             if (field.type == 'string' || field.type == 'bytes') {
//                 encTypes.push('bytes32')
//                 encValues.push(hexUtils.hash(value))
//             } else {
//                 encTypes.push(field.type)
//                 encValues.push(value)
//             }
//         }
//         hashValues.push(hexUtils.hash(abiCoder.encode(encTypes, encValues)))
//     }
//     return hexUtils.hash(hexUtils.concat(hashValues))
// }
//
// function encodeObjectData(primaryType, types: EIP712TypedDataField[], message) {
//     let encTypes: string[] = []
//     let encValues: string[] = []
//     encTypes.push('bytes32')
//     encValues.push(getEIP712TypeHash(primaryType, types))
//     for (let field of types) {
//         let value = message[field.name]
//         if (field.type == 'string' || field.type == 'bytes') {
//             encTypes.push('bytes32')
//             // const value2 = ethers.utils.keccak256(Buffer.from(value))
//             encValues.push(hexUtils.hash(value))
//         } else {
//             encTypes.push(field.type)
//             encValues.push(value)
//         }
//     }
//
//     return hexUtils.hash(abiCoder.encode(encTypes, encValues))
// }
// function HashEIP712(typeData: EIP712TypedData): string {
//     const domainHash = getEIP712DomainHash(typeData.domain)
//     const structHash = getEIP712StructHash(typeData.primaryType, typeData.types, typeData.message)
//     return hexUtils.hash(
//         hexUtils.concat(['0x1901', domainHash, structHash])
//     );
// }

export function privateKeyToAddress(privateKey: string) {
    privateKey = privateKey.substring(0, 2) == '0x' ? privateKey : '0x' + privateKey
    if (!utils.isHexString(privateKey)) throw new Error("Private key is not hex")
    // return new ethers.Wallet(privateKey).address
    const publicKey = computePublicKey(privateKey)
    return hexDataSlice(keccak256(hexDataSlice(publicKey, 1)), 12)
}

export function privateKeysToAddress(privateKeys: string[]) {
    if (!privateKeys || privateKeys.length == 0) throw new Error("Private keys undefind")
    let accounts = {}
    for (const val of privateKeys) {
        const address = privateKeyToAddress(val).toLowerCase();
        if (!accounts[address]) {
            accounts[address] = val.substring(0, 2) == '0x' ? val : '0x' + val
        }
    }
    return accounts
}

