import {stringToBytes} from "../src/utils/hepler";
import * as secrets from '../../../secrets.json'
import {privateKeysToAddress} from "../src/signature/eip712TypeData";

function toBytes(str: string): string {
    let bytes = '0x';
    for (let i = 0; i < str.length; i++) {
        bytes += str.charCodeAt(i).toString(16);
    }
    return bytes;
}
;(async () => {
    const str = "hello web3"
    console.assert(stringToBytes(str) == toBytes(str))
    console.log(privateKeysToAddress(secrets.privateKeys))
})()
