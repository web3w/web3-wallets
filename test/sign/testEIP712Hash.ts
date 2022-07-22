import {ethers, utils} from 'ethers'
import {getEIP712Hash, getEIP712TypeHash, getEIP712TypeHash1} from "../../src/utils/eip712TypeData";
import {id, _TypedDataEncoder as TypedDataEncoder} from "@ethersproject/hash";
import {TypedDataField} from "@ethersproject/abstract-signer";


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

const typeData: Record<string, Array<TypedDataField>> = {
    Person: [
        {name: 'name', type: 'string'},
        {name: 'wallet', type: 'address'}
    ],
    Mail: [
        {name: 'from', type: 'Person'},
        {name: 'to', type: 'Person'},
        {name: 'contents', type: 'string'}
    ]
}

// const typeHase =  TypedDataEncoder.from(typeData).encodeType('Mail')

// console.log(id(typeHase))

// const typeHash = getEIP712TypeHash('Mail',typeData.Mail)


// console.log( typeHash)


const STRUCT_SELL_NAME = 'NFTSellOrder';
const STRUCT_BUY_NAME = 'NFTBuyOrder';

const STRUCT_SELL_ABI = [
    {type: 'address', name: 'maker'},
    {type: 'address', name: 'taker'},
    {type: 'uint256', name: 'expiry'},
    {type: 'uint256', name: 'nonce'},
    {type: 'address', name: 'erc20Token'},
    {type: 'uint256', name: 'erc20TokenAmount'},
    {type: 'Fee[]', name: 'fees'},
    {type: 'address', name: 'nft'},
    {type: 'uint256', name: 'nftId'},
    {type: 'uint256', name: 'hashNonce'}
];

const STRUCT_BUY_ABI = [
    {type: 'address', name: 'maker'},
    {type: 'address', name: 'taker'},
    {type: 'uint256', name: 'expiry'},
    {type: 'uint256', name: 'nonce'},
    {type: 'address', name: 'erc20Token'},
    {type: 'uint256', name: 'erc20TokenAmount'},
    {type: 'Fee[]', name: 'fees'},
    {type: 'address', name: 'nft'},
    {type: 'uint256', name: 'nftId'},
    {type: 'Property[]', name: 'nftProperties'},
    {type: 'uint256', name: 'hashNonce'}
];

const FEE_ABI = [
    {type: 'address', name: 'recipient'},
    {type: 'uint256', name: 'amount'},
    {type: 'bytes', name: 'feeData'},
];
const PROPERTY_ABI = [
    {type: 'address', name: 'propertyValidator'},
    {type: 'bytes', name: 'propertyData'},
];

const TYPE_SELL_HASH = getEIP712TypeHash(STRUCT_SELL_NAME, STRUCT_SELL_ABI, {
    ['Fee']: FEE_ABI
});

const TYPE_SELL_HASH1 = getEIP712TypeHash1(STRUCT_SELL_NAME, STRUCT_SELL_ABI, {
    ['Fee']: FEE_ABI
});

console.log("\n", TYPE_SELL_HASH1, "\n", TYPE_SELL_HASH)

const TYPE_BUY_HASH = getEIP712TypeHash(STRUCT_BUY_NAME, STRUCT_BUY_ABI, {
    ['Fee']: FEE_ABI,
    ['Property']: PROPERTY_ABI,
});

const TYPE_BUY_HASH1 = getEIP712TypeHash1(STRUCT_BUY_NAME, STRUCT_BUY_ABI, {
    ['Fee']: FEE_ABI,
    ['Property']: PROPERTY_ABI,
});

console.log("\n", TYPE_BUY_HASH1, "\n", TYPE_BUY_HASH)


