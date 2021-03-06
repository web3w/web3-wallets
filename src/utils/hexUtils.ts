// import {ethers} from "ethers";
import {
    Bytes,
    concat,
    hexValue,
    isHexString,
    hexConcat,
    hexZeroPad,
    hexDataSlice,
} from "@ethersproject/bytes";
import {isAddress} from "@ethersproject/address";
import {keccak256} from "@ethersproject/keccak256";
import {toUtf8Bytes} from "@ethersproject/strings";
import {BigNumber} from "@ethersproject/bignumber";
import {NULL_BLOCK_HASH} from "../constants/index";
// import {Buffer} from "buffer"

export const messagePrefix = "\x19Ethereum Signed Message:\n";

const WORD_LENGTH = 32;
export const hexUtils = {
    concat(args: Array<string>): string {
        const hex = args.find(val => !hexUtils.isHex(val) || val.length < 4)
        if (hex) throw  new Error(hex + " is not hex string")
        return hexConcat(args);
    },
    isHex(s: string, length?: number): boolean {
        return isHexString(s, length);
    },
    isAddress(address: string) {
        return isAddress(address)
    },
    toShortHex(message: string | number , isPrefix = true): string {
        const hex = hexValue(message)
        if (hex.length === 3) {
            const num = hex.split('x')
            return isPrefix ? num[0] + 'x0' + num[1] : num[0] + num[1]
        } else {
            console.warn("not short")
            return isPrefix ? hex : hex.substring(2)
        }
    },
    toHex(message: string | number, isPrefix = true): string {
        const hex = hexValue(message)
        return isPrefix ? hex : hex.substring(2)
    },
    hashMessage(message: Bytes | string): string {
        // assert.isHexString("hash", hash)
        if (typeof (message) === "string") {
            message = toUtf8Bytes(message);
        }
        return keccak256(concat([
            toUtf8Bytes(messagePrefix),
            toUtf8Bytes(String(message.length)),
            message
        ]));
        // return hexUtils.hash(hexUtils.concat(['\x19Ethereum Signed Message:\n32', hash]))
        // return hexUtils.hash(Buffer.from(['\x19Ethereum Signed Message:\n32', hash].join("")))
    },

    // export function hashMessage(message: Bytes | string): string {
    //     if (typeof(message) === "string") { message = toUtf8Bytes(message); }
    //     return keccak256(concat([
    //         toUtf8Bytes(messagePrefix),
    //         toUtf8Bytes(String(message.length)),
    //         message
    //     ]));
    // }
    hash(message: Bytes | string, isPrefix = true): string {
        if (message == "0x") {
            return isPrefix ? NULL_BLOCK_HASH : NULL_BLOCK_HASH.substring(2);
        }

        // if (typeof (message) === "string" ) {
        if (!isHexString(message)) {
            // console.log(typeof (message) === "object" && message.length > 0 ? hexUtils.toHex(message as Buffer) : message)
            message = toUtf8Bytes(message as string);
        }

        const hex = keccak256(message)
        return isPrefix ? hex : hex.substring(2);
    },
    leftPad(n: string | number, _size: number = WORD_LENGTH): string {
        if (isHexString(n)) {

            n = hexUtils.toHex(n)
        } else if (typeof (n) === "string") {
            if (n.match(/^-?[0-9]+$/)) {
                n = hexUtils.stringToBytes(n)
                // if (n.toString().length > _size) throw new Error("n length > size")
                if (n.toString().length > _size) {
                    n = hexUtils.hash(n)
                }
            }
        } else if (n === 0) {
            n = hexUtils.toHex(n)
        } else {
            n = hexUtils.toHex(n)
        }

        return hexZeroPad(n, _size)
    },
    rightPad(n: string | number, _size: number = WORD_LENGTH): string {
        return BigNumber.from(n).shl(_size * 8).toHexString().substring(0, _size * 2) + "00"
    },
    slice(n: string | number, start: number, end?: number): string {
        let hex = ""
        if (typeof (n) == "string") {
            hex = n
        }
        if (typeof (n) == "number") {
            hex = hexUtils.toHex(n)
        }
        return hexDataSlice(hex, start, end)
    },
    split(hex: string, _size: number = WORD_LENGTH, isPrefix?: boolean): string[] {
        const str = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
        const arr: string[] = [];
        let index = 0;
        while (index < str.length) {
            const end = index + _size
            const strPart = str.slice(index, end)
            arr.push(isPrefix ? '0x' + strPart : strPart)
            index = end
        }
        return arr
    },
    stringToByte32(str: string) {
        return keccak256(
            toUtf8Bytes(str)
        );
    },
    stringToBytes(str: string) {
        return hexValue(
            toUtf8Bytes(str)
        )
    }
}
