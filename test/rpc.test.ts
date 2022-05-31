
import {getChainRpcUrl} from "../src/utils/rpc";

const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
    const chainId = 97

    const url = "https://segmentfault.com/q/1010000013437141"
    const ff = await fetch(url, {method: 'HEAD'})
    const res = await getChainRpcUrl(chainId,true)
    console.log(res)

})()
