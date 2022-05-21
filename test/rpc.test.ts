import {Asset, ethSend, getEstimateGas, UserAccount} from "../index";
import * as secrets from '../../../secrets.json'
import {asset721, asset1155, erc20Tokens} from "./assets";
import {ethers} from "ethers";
import {EIP712TypedData} from "../src/types";
import {getRpcUrl} from "@walletconnect/utils";
import {getChainRpcUrl} from "../src/utils/rpc";

const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
    const chainId = 1

    const url = "https://segmentfault.com/q/1010000013437141"
    const ff = await fetch(url, {method: 'HEAD'})
    const res = await getChainRpcUrl(chainId)
    console.log(res)

})()
