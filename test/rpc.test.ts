import {getBlockByNumber, getChainRpcUrl, getTransactionByHash, getTransactionReceipt} from "../src/utils/rpc";

(async () => {
    const chainId = 4
    const rpcUrl = await getChainRpcUrl(chainId, true)
    console.log(rpcUrl)
    const blockNum = 10862111
    const block = await getBlockByNumber(rpcUrl, blockNum)

    console.assert(Number(block.result.number) == blockNum)

    const txHash = "0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"
    const receipt = await getTransactionReceipt(rpcUrl, txHash)
    console.assert(receipt.result.transactionHash == txHash)
    const tx = await getTransactionByHash(rpcUrl, txHash)
    console.assert(tx.result.hash == txHash)

})()
