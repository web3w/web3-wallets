import * as secrets from '../../../secrets.json'
import {privateKeysToAddress} from "../src/utils/eip712TypeData";
import {hexUtils} from "../src/utils/hexUtils";
import {ethers} from "ethers";
import {computePublicKey} from "@ethersproject/signing-key";
import {hexDataSlice} from "@ethersproject/bytes";
import {keccak256} from "@ethersproject/keccak256";

function toBytes(str: string): string {
    let bytes = '0x';
    for (let i = 0; i < str.length; i++) {
        bytes += str.charCodeAt(i).toString(16);
    }
    return bytes;
}
;(async () => {
    const str = "hello web3"
    console.assert(hexUtils.stringToBytes(str) == toBytes(str))
    // console.log(privateKeysToAddress(secrets.privateKeys))
    const privateKey = secrets.privateKeys[0]
    const publicKey = computePublicKey(privateKey)
    const address = hexDataSlice(keccak256(hexDataSlice(publicKey, 1)), 12)

    console.assert(new ethers.Wallet(privateKey).address.toLowerCase() == address)

})()
