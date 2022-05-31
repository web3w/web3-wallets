// import {TypedDataDomain, TypedDataField} from "@ethersproject/abstract-signer";

import {ethers, utils} from "ethers";
import {assert, schemas} from "../utils/assert";
import {hexUtils, abiCoder} from "./hexUtils";


export {hexUtils, assert, schemas, abiCoder}


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

// export interface TypedDataDomain {
//     name?: string;
//     version?: string;
//     chainId?: BigNumberish;
//     verifyingContract?: string;
//     salt?: BytesLike;
// };

export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}

export type EIP712MessageValue = string | number | never[] | EIP712Message;

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
    assert.isETHAddressHex('verifyingContract', domain.verifyingContract)
    assert.isString('primaryType', primaryType)
    assert.doesConformToSchema('domain', domain, schemas.eip712DomainSchema)
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
    assert.doesConformToSchema('typedData', typedData, schemas.eip712TypedDataSchema)
    return typedData
}

export function ecSignHash(hash: string, privateKey: string): ECSignature {
    if (!hexUtils.isHex(hash, 32)) throw new Error('Message not hex')
    if (!hexUtils.isHex(privateKey, 32)) throw new Error("Private key error")
    const ecSign = new ethers.Wallet(privateKey)
    const sign = ecSign._signingKey().signDigest(hash)
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

// hash = 0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f
export const EIP712_DOMAIN_TYPEHASH = hexUtils.hash("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

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

//-------------- get type Hash -----------------
function encodeType(structName: string, abi: EIP712TypedDataField[]): string {
    return [`${structName}(`, abi.map(a => `${a.type} ${a.name}`).join(','), ')'].join('');
}

/**
 * Compute the type hash of an EIP712 struct given its ABI.
 */
export function getEIP712TypeHash(
    primaryStructName: string,
    primaryStructAbi: EIP712TypedDataField[],
    referencedStructs: EIP712Types = {},
): string {
    const primaryStructType = encodeType(primaryStructName, primaryStructAbi);
    // Referenced structs are sorted lexicographically
    // @ts-ignore
    const referencedStructTypes = Object.entries(referencedStructs)
        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
        .map(([name, abi]) => encodeType(name, abi));
    // console.log(referencedStructTypes)
    return hexUtils.hash(Buffer.from(primaryStructType + referencedStructTypes.join('')));
}

//-------------- get struct Hash -----------------

function encodeDataRefer(types, values, encTypes, encValues) {
    for (let message of values) {
        for (let field of types) {
            let value = message[field.name] as any
            if (field.type == 'string' || field.type == 'bytes') {
                encTypes.push('bytes32')
                value = ethers.utils.keccak256(Buffer.from(value))
                encValues.push(value)
            } else {
                encTypes.push(field.type)
                encValues.push(value)
            }
        }
    }
}

function encodeData(primaryType: string, typeData: EIP712TypedData) {
    let encTypes: string[] = []
    let encValues: string[] = []
    const types = typeData.types
    const primaryTypeData = types[primaryType]
    if (types[primaryType]) {
        delete types[primaryType]
        delete types.EIP712Domain
    }
    const message = typeData.message
    // Add typehash
    encTypes.push('bytes32')
    encValues.push(getEIP712TypeHash(primaryType, primaryTypeData, types))

    // @ts-ignore
    for (let field of primaryTypeData) {
        let value = message[field.name] as any
        if (field.type == 'string' || field.type == 'bytes') {
            encTypes.push('bytes32')
            value = ethers.utils.keccak256(Buffer.from(value))
            encValues.push(value)
        } else { // @ts-ignore
            if (field.type.lastIndexOf(']') === field.type.length - 1) {
                encTypes.push('bytes32')
                const type = field.type.substring(0, field.type.length - 2);
                encValues.push(getEIP712TypeHash(type, types[type]))
                encodeDataRefer(types[type], value, encTypes, encValues)
                // throw 'TODO: Arrays currently unimplemented in encodeData'
            } else {
                encTypes.push(field.type)
                encValues.push(value)
            }
        }
    }
    // console.log(encTypes, encValues)
    return abiCoder.encode(encTypes, encValues)
}

export function getEIP712StructHash(typeData: EIP712TypedData) {
    // console.log(primaryType)
    const primaryType = typeData.primaryType
    const strBuff = encodeData(primaryType, typeData)
    return ethers.utils.keccak256(strBuff)
}

/**
 * Compute a complete EIP712 hash given a struct hash.
 */
export function getEIP712Hash(typeData: EIP712TypedData): string {
    const domainHash = getEIP712DomainHash(typeData.domain)
    // console.log("domainHash", domainHash)
    const structHash = getEIP712StructHash(typeData)
    // console.log("structHash", structHash)
    return hexUtils.hash(
        hexUtils.concat(['0x1901', domainHash, structHash])
    );
}
