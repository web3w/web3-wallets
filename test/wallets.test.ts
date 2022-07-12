import {getBlockByNumber, getChainRpcUrl, getTransactionByHash, getTransactionReceipt} from "../src/utils/rpc";
import {Web3Wallets} from "../src/index";

(async () => {
    const chainId = 4
    const wallet = new Web3Wallets({chainId})

    const blockNow = await wallet.getBlock()
    const blockNum = await wallet.getBlockNumber()
    const block = await wallet.getBlockByNumber(blockNum)

    console.assert(Number(block.result.number) == blockNum)
    const txHash = "0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"
    const receipt = await wallet.getTransactionReceipt(txHash)
    console.assert(receipt.result.transactionHash == txHash)
    const tx = await wallet.getTransactionByHash(txHash)
    console.assert(tx.result.hash == txHash)

})()
