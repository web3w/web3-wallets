
import {ethers} from "ethers";

const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {

    const rpcUrl = "http://127.0.0.1:8545"
    const blockNumber = `{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":0}`
    const blockNumberRes = await ethers.utils.fetchJson(rpcUrl, blockNumber)
    console.log(blockNumberRes)
})()
