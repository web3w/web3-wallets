import {TypedDataDomain, TypedDataField} from "@ethersproject/abstract-signer";

import {ethers} from "ethers";
import {assert, schemas} from "./assert";
import {Bytes, concat} from "@ethersproject/bytes";
import {keccak256} from "@ethersproject/keccak256";


export type {TypedDataDomain, TypedDataField}

export enum SignatureType {
    EthSign = 1,
    EIP712 = 2
}

export interface ECSignature {
    v: number;
    r: string;
    s: string;
}

export interface Signature extends ECSignature {
    signatureType: SignatureType;
}


export interface EIP712Types {
    [key: string]: TypedDataField[];
}

export type EIP712ObjectValue = string | number | never[] | EIP712Object;

export interface EIP712Object {
    [key: string]: EIP712ObjectValue;
}

export interface EIP712TypedData {
    types: EIP712Types
    domain: TypedDataDomain
    message: EIP712Object
    primaryType: string
}


export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}

export const messagePrefix = "\x19Ethereum Signed Message:\n";


const WORD_LENGTH = 32;
export const hexUtils = {
    concat(args: Array<string>): string {
        return ethers.utils.hexConcat(args);
    },
    isHex(s: string): boolean {
        return ethers.utils.isHexString(s);
    },
    toHex(n: string | number | Buffer): string {
        return ethers.utils.hexValue(n)
    },
    hashMessage(message: Bytes | string): string {
        // assert.isHexString("hash", hash)
        if (typeof (message) === "string") {
            message = Buffer.from(message);
        }
        return keccak256(concat([
            Buffer.from(messagePrefix),
            Buffer.from(String(message.length)),
            message
        ]));
        // return hexUtils.hash(hexUtils.concat(['\x19Ethereum Signed Message:\n32', hash]))
        // return hexUtils.hash(Buffer.from(['\x19Ethereum Signed Message:\n32', hash].join("")))
    },
    hash(message: Bytes | string): string {
        // return ethers.utils.keccak256(hexUtils.toHex(message))
        if (typeof (message) === "string" && !ethers.utils.isHexString(message)) {
            message = Buffer.from(message);
        }
        return keccak256(message);
    },
    leftPad(n: string | number, _size: number = WORD_LENGTH): string {
        if (ethers.utils.isHexString(n)) {
            n = hexUtils.toHex(n)
        } else if (typeof (n) === "string") {
            if (n.match(/^-?[0-9]+$/)) {
                n = hexUtils.toHex(Number(n))
            }
        } else {
            n = n.toString()
        }
        return ethers.utils.hexZeroPad(n, _size)
    },
    rightPad(n: string | number, _size: number = WORD_LENGTH): string {
        return ethers.BigNumber.from(n).shl(_size * 8).toHexString().substring(0, _size * 2) + "00"
    }
}

export function createTypedData(
    primaryType: string,
    types: EIP712Types,
    message: EIP712Object,
    domain: EIP712Domain
): EIP712TypedData {
    assert.isETHAddressHex('verifyingContract', domain.verifyingContract)
    assert.isString('primaryType', primaryType)
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

export function ecSignMessage(message: string, privateKey: string) {
    if (!ethers.utils.isHexString(message)) {
        message = ethers.utils.hexValue(message)
    }
    if (!privateKey) throw "privateKey error"
    const ecSign = new ethers.Wallet(privateKey)
    return ecSign._signingKey().signDigest(message)
}

// hash = 0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f
export const DOMAIN_TYPEHASH = hexUtils.hash("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

/**
 * Get the hash of the EIP712 domain.
 */
export function getEIP712DomainHash(eip712Domain: TypedDataDomain, domainTypeHash = DOMAIN_TYPEHASH): string {
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
        domainHex.push(hexUtils.leftPad(eip712Domain.chainId.toString()))
    }
    if (eip712Domain.verifyingContract) {
        console.log(eip712Domain.verifyingContract)
        domainHex.push(hexUtils.leftPad(eip712Domain.verifyingContract))
    }
    return hexUtils.hash(hexUtils.concat(domainHex));
}

/**
 * Compute a complete EIP712 hash given a struct hash.
 */
export function getEIP712Hash(eip712Domain: TypedDataDomain, structHash: string): string {
    return hexUtils.hash(
        hexUtils.concat(['0x1901', getEIP712DomainHash(eip712Domain), structHash])
    );
}

//-------------- get struct Hash -----------------
function encodeType(structName: string, abi: TypedDataField[]): string {
    return [`${structName}(`, abi.map(a => `${a.type} ${a.name}`).join(','), ')'].join('');
}

/**
 * Compute the type hash of an EIP712 struct given its ABI.
 */
export function getTypeHash(
    primaryStructName: string,
    primaryStructAbi: TypedDataField[],
    referencedStructs: EIP712Types = {},
): string {
    const primaryStructType = encodeType(primaryStructName, primaryStructAbi);
    // Referenced structs are sorted lexicographically
    const referencedStructTypes = Object.entries(referencedStructs)
        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
        .map(([name, abi]) => encodeType(name, abi));
    // console.log(referencedStructTypes)
    return hexUtils.hash(Buffer.from(primaryStructType + referencedStructTypes.join('')));
}


// console.log(EXCHANGE_PROXY_DOMAIN_TYPEHASH)

// // "ElementEx" //ZeroEx
// const domain = {
//     chainId: 1,
//     verifyingContract: '0x0000000000000000000000000000000000000000',
//     name: 'ZeroEx',
//     version: '1.0.0',
// };
//
// //0xc92fa40dbe33b59738624b1b4ec40b30ff52e4da223f68018a7e0667ffc0e798
// const foo = getEIP712DomainHash(domain)
// console.log(foo)


// const foo1 = hexUtils.rightPad("1")
// console.log(foo1)

// 0x000000000000000000000000000000000000000000000000000000000000000b
// 0x127ed90000000000000000000000000000000000000000000000000000000000
// 0x0b0000000000000000000000000000000000000000000000000000000000000000
// 0x127ed900000000000000000000000000000000000000000000000000000000
// 0x0b000000000000000000000000000000000000000000000000000000000000
// 0x0b0000000000000000000000000000
// const foo1 = hexUtils.rightPad(1212121,10)
// console.log(foo1)
