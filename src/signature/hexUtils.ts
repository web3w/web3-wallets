import {ethers, utils} from "ethers";
import {Bytes, concat} from "@ethersproject/bytes";
import {keccak256} from "@ethersproject/keccak256";

export const messagePrefix = "\x19Ethereum Signed Message:\n";

export const abiCoder = new utils.AbiCoder()

const WORD_LENGTH = 32;
export const hexUtils = {
    concat(args: Array<string>): string {
        const hex = args.find(val => !hexUtils.isHex(val) || val.length < 4)
        if (hex) throw hex + " is not hex string"
        return ethers.utils.hexConcat(args);
    },
    isHex(s: string,length?: number): boolean {
        return ethers.utils.isHexString(s,length);
    },
    toShortHex(message: string | number | Buffer, isPrefix = true): string {
        const hex = ethers.utils.hexValue(message)
        if (hex.length === 3) {
            const num = hex.split('x')
            return isPrefix ? num[0] + 'x0' + num[1] : num[0] + num[1]
        } else {
            console.warn("not short")
            return isPrefix ? hex : hex.substring(2)
        }
    },
    toHex(message: string | number | Buffer, isPrefix = true): string {
        const hex = ethers.utils.hexValue(message)
        return isPrefix ? hex : hex.substring(2)
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
    hash(message: Bytes | string, isPrefix = true): string {
        // return ethers.utils.keccak256(hexUtils.toHex(message))
        if (typeof (message) === "string" && !ethers.utils.isHexString(message)) {
            message = Buffer.from(message);
        }
        const hex = keccak256(message)
        return isPrefix ? hex : hex.substring(2);
    },
    leftPad(n: string | number, _size: number = WORD_LENGTH): string {
        if (ethers.utils.isHexString(n)) {
            n = hexUtils.toHex(n)
        } else if (typeof (n) === "string") {
            if (n.match(/^-?[0-9]+$/)) {
                n = hexUtils.toHex(Buffer.from(n))
            }
        } else if (n === 0) {
            n = hexUtils.toHex(n)
        } else {
            n = hexUtils.toHex(n)
        }
        return ethers.utils.hexZeroPad(n, _size)
    },
    rightPad(n: string | number, _size: number = WORD_LENGTH): string {
        return ethers.BigNumber.from(n).shl(_size * 8).toHexString().substring(0, _size * 2) + "00"
    },
    slice(n: string | number, start: number, end?: number): string {
        const hex = hexUtils.toHex(n).substring(2);
        const sliceStart = start >= 0 ? start * 2 : Math.max(0, hex.length + start * 2);
        let sliceEnd = hex.length;
        if (end !== undefined) {
            sliceEnd = end >= 0 ? end * 2 : Math.max(0, hex.length + end * 2);
        }
        return '0x'.concat(hex.substring(sliceStart, sliceEnd));
    }
}
