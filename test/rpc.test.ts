import { getChainRpcUrl,getBlockByNumber} from "../src/utils/rpc"; 
//, {proxyUrl: "http://127.0.0.1:7890"}

(async () => {

    const signFunc = await fetch("https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/a9059cbb")
    const res = await signFunc.text()
    const chainId = 4
    const rpcUrl = await getChainRpcUrl(chainId, true)
    console.log(rpcUrl)
    const blockNum = 10862111
    const block = await getBlockByNumber("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", blockNum)

    console.log(block)
    // console.assert(Number(block.result.number) == blockNum)

    // const txHash = "0xbfe24528d5e90822924687d28d55dc492a65660d205c5619d8116780c69497f6"
    // const receipt = await getTransactionReceipt(rpcUrl, txHash)
    // console.assert(receipt.result.transactionHash == txHash)
    // const tx = await getTransactionByHash(rpcUrl, txHash)
    // console.assert(tx.result.hash == txHash)

})()
