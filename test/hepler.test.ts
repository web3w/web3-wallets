import * as secrets from '../../../secrets.json'
import { privateKeysToAddress } from "../src/utils/eip712TypeData";
import { hexUtils } from "../src/utils/hexUtils";
import { ethers } from "ethers";
import { computePublicKey } from "@ethersproject/signing-key";
import {hexDataSlice, hexValue} from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import {Buffer} from "buffer";
import {toUtf8Bytes} from "@ethersproject/strings";

function toBytes(str: string): string {
    let bytes = '0x';
    for (let i = 0; i < str.length; i++) {
        bytes += str.charCodeAt(i).toString(16);
    }
    return bytes;
}
; (async () => {
    const n = "12344"
    if(n.match(/^-?[0-9]+$/)) {
        console.log(n)
        console.log(hexUtils.stringToBytes(n))
    }

    const str = "hello web3"
    console.assert(hexUtils.hash("hello web3") == "0x6c171485a0138b7b0a49d72b570e1d9c589d42a79ae57329d90671d1ac702d74")
    //
    debugger
    console.assert(hexUtils.stringToBytes(str) == toBytes(str))
    // console.log(privateKeysToAddress(secrets.privateKeys))
    const privateKey = secrets.privateKeys[0]
    const publicKey = computePublicKey(privateKey)
    const address = hexDataSlice(keccak256(hexDataSlice(publicKey, 1)), 12)

    console.assert(new ethers.Wallet(privateKey).address.toLowerCase() == address)

})()
