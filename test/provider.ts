import * as secrets from '../../../secrets.json'
import {privateKeysToAddress} from "../src/signature/eip712TypeData";


const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
    const chainId = 97

    console.log(privateKeysToAddress(secrets.privateKeys))

})()
