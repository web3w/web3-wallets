// https://docs.ethers.io/v5/api/signer/
import {ethers} from 'ethers'
import secrets from '../../../../secrets.json'
import * as ethjs from 'ethereumjs-util';
import {hashMessage} from "@ethersproject/hash";
import {ecSignMessage, signMessage} from "../../index";
import {hexUtils} from "../../src/utils/hexUtils";
import {ecSignHash, joinECSignature} from "../../src/utils/eip712TypeData";

export function ecSignHashWithKey(hash: string, key: string) {
    const {v, r, s} = ethjs.ecsign(ethjs.toBuffer(hash), ethjs.toBuffer(key));
    return {
        v,
        r: ethjs.bufferToHex(r),
        s: ethjs.bufferToHex(s),
    };
}

(async () => {
    const sigeAddr = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A'
    const signerPrivate = secrets.accounts[sigeAddr]
    const message = '0'
    const ethMsgHash1 = hashMessage(message)
    const ethMsgHash2 = hexUtils.hashMessage(message)
    console.assert(ethMsgHash1 == ethMsgHash2, 'hashMessage')

    const wallet = new ethers.Wallet(signerPrivate)
    const ethMsgSign1 = await wallet.signMessage(message)
    const ethMsgSign2 = signMessage(message, signerPrivate)

    console.assert(ethMsgSign1 == joinECSignature(ethMsgSign2), `signMessage \n ${ethMsgSign1} \n ${ethMsgSign2}`)

    const signMsg = ecSignMessage(message, signerPrivate)
    const ecSignMsg = ecSignHashWithKey(hexUtils.hash(message), signerPrivate)
    console.assert(signMsg.r == ecSignMsg.r, 'ecSignMessage')

    const signMsg1 = ecSignHash(ethMsgHash1, signerPrivate)
    const ecSignMsg1 = ecSignHashWithKey(ethMsgHash1, signerPrivate)
    console.assert(signMsg1.r == ecSignMsg1.r, 'ecSignMessage1')


})()


