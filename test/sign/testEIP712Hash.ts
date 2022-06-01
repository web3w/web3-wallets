import {ethers, utils} from 'ethers'
import {getEIP712Hash} from "../../src/signature/eip712TypeData";

const typedData = {
    types: {
        EIP712Domain: [
            {name: 'name', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'}
        ],
        Person: [
            {name: 'name', type: 'string'},
            {name: 'wallet', type: 'address'}
        ],
        Mail: [
            {name: 'from', type: 'Person'},
            {name: 'to', type: 'Person'},
            {name: 'contents', type: 'string'}
        ]
    },
    primaryType: 'Mail',
    domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    },
    message: {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        },
        contents: 'Hello, Bob!'
    }
}


const hash = "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2"
const hash1 = getEIP712Hash(typedData)
console.assert(hash == hash1, "Sign Hash:")
