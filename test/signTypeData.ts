import {Asset, ethSend, getEstimateGas, UserAccount} from "../index";
import * as secrets from '../../../secrets.json'
import {asset721, asset1155, erc20Tokens} from "./assets";
import {ethers} from "ethers";
import {EIP712TypedData} from "../src/types";

const data = {
    "domain": {
        "chainId": 4,
        "verifyingContract": "0x8D6022B8A421B08E9E4cEf45E46f1c83C85d402F",
        "name": "ElementEx",
        "version": "1.0.0"
    },
    "primaryType": "ERC1155SellOrder",
    "message": {
        "maker": "0x9F7A946d935c8Efc7A8329C0d894A69bA241345A",
        "taker": "0x0000000000000000000000000000000000000000",
        "expiry": "86410",
        "nonce": "10",
        "erc20Token": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "erc20TokenAmount": "1",
        "fees": [],
        "erc1155Token": "0x9F7A946d935c8Efc7A8329C0d894A69bA241345A",
        "erc1155TokenId": "2",
        "erc1155TokenAmount": "1",
        "hashNonce": "0"
    },
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "ERC1155SellOrder": [
            {
                "type": "address",
                "name": "maker"
            },
            {
                "type": "address",
                "name": "taker"
            },
            {
                "type": "uint256",
                "name": "expiry"
            },
            {
                "type": "uint256",
                "name": "nonce"
            },
            {
                "type": "address",
                "name": "erc20Token"
            },
            {
                "type": "uint256",
                "name": "erc20TokenAmount"
            },
            {
                "type": "Fee[]",
                "name": "fees"
            },
            {
                "type": "address",
                "name": "erc1155Token"
            },
            {
                "type": "uint256",
                "name": "erc1155TokenId"
            },
            {
                "type": "uint128",
                "name": "erc1155TokenAmount"
            },
            {
                "type": "uint256",
                "name": "hashNonce"
            }
        ],
        "Fee": [
            {
                "type": "address",
                "name": "recipient"
            },
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "bytes",
                "name": "feeData"
            }
        ]
    }
}
const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
    const chainId = 97
    const user = new UserAccount({
        chainId,
        address: seller,
        priKey: secrets.accounts[seller]
    })

    const signMsg = await user.signMessage("hello")
    console.log(signMsg)
    const sign = await user.signTypedData(data as EIP712TypedData)
    console.log(sign)
})()
