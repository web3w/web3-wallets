import {ethers} from "ethers";

export function objectClone(str: object) {
    return JSON.parse(JSON.stringify(str))
}

export function itemsIsEquality(items: string[]) {
    return items.every(el => el === items[0])
}

export function isAddress(address: string) {
    return ethers.utils.isAddress(address)
}

export function stringToBytes(str: string): string {
    return ethers.utils.hexValue(
        ethers.utils.toUtf8Bytes(str)
    )
}

export function stringToByte32(str: string): string {
    return ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(str)
    );
}


