// https://docs.ethers.io/v5/api/signer/
import {ethers} from 'ethers'
import secrets from '../../../../secrets.json'
import * as ethjs from 'ethereumjs-util';
import {hashMessage} from "@ethersproject/hash";

// const account1 = web3.eth.accounts.wallet.add()
// const account2 = web3.eth.accounts.wallet.add(secrets.accounts['0xeb1e5B96bFe534090087BEb4FB55CC3C32bF8bAA'])

/**
 * Generate the EC signature for a hash given a private key.
 */
export function ecSignHashWithKey(hash: string, key: string) {
    const {v, r, s} = ethjs.ecsign(ethjs.toBuffer(hash), ethjs.toBuffer(key));
    return {
        v,
        r: ethjs.bufferToHex(r),
        s: ethjs.bufferToHex(s),
    };
}

(async () => {

    // web3AccountSignature 0x70c3169996e404a237d97567a0977d3cea9c97eb67e51df5eacc9dd5047f46445a98eeb7f72743d98e14130011fe572f8e63955ea12be65cbc6097e97572e17e1c
    // web3EthSignature 0x70c3169996e404a237d97567a0977d3cea9c97eb67e51df5eacc9dd5047f46445a98eeb7f72743d98e14130011fe572f8e63955ea12be65cbc6097e97572e17e1c

    // const signer = web3.eth.accounts.wallet.add(secrets.accounts['0x32f4B63A46c1D12AD82cABC778D75aBF9889821a'])
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    const sigeAddr = '0x3f5D3070Fc7924479B5e367a83EC2b284E9c4e04'
    const signerPrivate = secrets.accounts[sigeAddr]
    const testAddr = 'hello world'
    // const hash = hashMessage(testAddr)
    const wallet = new ethers.Wallet(signerPrivate)
    const signature = await wallet.signMessage(testAddr)
    // console.log(signature)

    const ecSign = new ethers.Wallet(signerPrivate)
    const signMsg = ecSign._signingKey().signDigest(hashMessage(testAddr))
    const ecSignMsg = ecSignHashWithKey(hashMessage(testAddr), signerPrivate)
    console.log(signMsg,ecSignMsg)
})()


// const hashAddr = ethers.utils.keccak256(testAddr)
// const binaryData = ethers.utils.arrayify(testAddr)

