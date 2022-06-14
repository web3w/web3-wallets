
import {getChainRpcUrl} from "../src/utils/rpc";
import {hexUtils} from "../src/signature/hexUtils";

const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
    const chainId = 97

    const foo = hexUtils.leftPad("29865734822577046633707807835512349254952034870712741802666134457736402829313")
    console.log(foo)
    // 29865734822577046633707807835512349254952034870712741802666134457736402829313

    const url = "https://segmentfault.com/q/1010000013437141"
    const ff = await fetch(url, {method: 'HEAD'})
    const res = await getChainRpcUrl(chainId,true)
    console.log(res)

})()
