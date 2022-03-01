import {ethers, Signer, providers} from "ethers";
import {Block} from '@ethersproject/abstract-provider'
import BigNumber from "bignumber.js";
import {getFeeHistory} from "./rpc";

// 取中间3个数的平均数
function bignumberMedian(values) {
    if (values.length < 4) throw new Error("inputs len < 4");

    values = values.sort(function (a, b) {
        return (new BigNumber(a)).gt(new BigNumber(b)) ? 1 : -1;
    });

    for (let i = 0; i < values.length; i++) {
        // console.log(new BigNumber(values[i]).toFixed())
    }

    let half = Math.floor(values.length / 2);
    return (new BigNumber(values[half - 1]).plus(new BigNumber(values[half])).plus(new BigNumber(values[half + 1]))).dividedToIntegerBy(3);
}

// from fee history

export async function get1559Fee(rpcURl: string) {
    const url = rpcURl || "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    let feeHistory = await getFeeHistory(url, 5, [25, 75])

    let priorityFeeArray: BigNumber[] = []
    // 对priority fee是用户付给矿工的小费，这里要取中位数，免得有人给太大把平均数拉上去
    for (let i = 0; i < feeHistory.reward.length; i++) {
        for (let j = 0; j < feeHistory.reward[i].length; j++) {
            let tmpFee = new BigNumber(feeHistory.reward[i][j]);
            if (tmpFee.lte(0)) {
                continue
            }
            priorityFeeArray.push(tmpFee)
            // console.log(tmpFee.toFixed())
        }
    }

    // 最终的priorityFee TODO:
    let priorityFee = bignumberMedian(priorityFeeArray)

    // 对baseFee这里加权平均就行了
    let totalBaseFee = new BigNumber(0)
    let baseFeeCount = 0
    let maxBaseFee = new BigNumber(10e18) // TODO: max
    let minBaseFee = new BigNumber(0)
    for (let i = 0; i < feeHistory.baseFeePerGas.length; i++) {
        let tmpFee = new BigNumber(feeHistory.baseFeePerGas[i]);
        if (tmpFee.lte(0)) {
            continue
        }
        // 去掉一个最大值,最小值
        if (tmpFee.gt(maxBaseFee)) {
            maxBaseFee = tmpFee
        } else if (tmpFee.lt(minBaseFee)) {
            minBaseFee = tmpFee
        } else {
            totalBaseFee = totalBaseFee.plus(tmpFee)
            baseFeeCount += 1
        }
    }

    // 最终的baseFee
    let baseFee = totalBaseFee.dividedToIntegerBy(baseFeeCount)

    // 避免 base Fee 过低
    if (baseFee.lte(2e9)) {
        baseFee = new BigNumber(5e9);
    }

    // 最终的maxFee, 一定要取整，不能有小数
    let maxFee = baseFee.multipliedBy(1.125).plus(priorityFee)

    // console.log("maxFee: %s, maxPriorityFee: %s， baseFee: %s", maxFee.toFixed(0), priorityFee.toFixed(0), baseFee.toFixed(0))
    console.log("maxFee: %s, maxPriorityFee: %s， baseFee: %s", maxFee.div(1e9).toFixed(0), priorityFee.div(1e9).toFixed(0), baseFee.div(1e9).toFixed(0))


    return {maxPriorityFeePerGas: priorityFee.toFixed(0), maxFeePerGas: maxFee.toFixed(0)}
}


////------- from block-----
export function getBaseFeePerGas(block: Block): ethers.BigNumber {
    // 0.875 × PreviousBaseFee ≤ BaseFee ≤ 1.125 × PreviousBaseFee
    if (!block.baseFeePerGas) {
        console.error(block, 'Block not support 1159')
        return ethers.BigNumber.from(0)
    }
    const speed = ethers.BigNumber.from(1250)
    let k = ethers.BigNumber.from(10000)
    const kGas = block.gasLimit.div(2).div(speed)
    const remainGas = block.gasLimit.sub(block.gasUsed)
    if (remainGas.lt(block.gasLimit.div(2))) {
        // block full
        let diff = remainGas.div(kGas)
        diff = diff.gte(speed) ? diff : speed
        k = k.add(diff)
    } else {
        // block empty
        let diff = remainGas.sub(block.gasLimit.div(2)).div(kGas)
        diff = diff.gte(speed) ? speed : diff
        k = k.sub(diff)
    }
    return block.baseFeePerGas.mul(k).mul(110).div(1000000)
}

export function getBaseFeePerGasBN(block: any): BigNumber {
    if (!block.baseFeePerGas) {
        console.error(block, 'Block not support 1159')
        return new BigNumber('0')
    }
    const speed = new BigNumber(1250)
    let k = new BigNumber(10000)
    const gasLimit = new BigNumber(block.gasLimit)
    const kGas = gasLimit.div(2).div(speed)
    const remainGas = gasLimit.minus(block.gasUsed)
    if (remainGas.lt(gasLimit.div(2))) {
        // block full
        let diff = remainGas.div(kGas)
        diff = diff.gte(speed) ? diff : speed
        k = k.plus(diff)
    } else {
        // block empty
        let diff = remainGas.minus(gasLimit.div(2)).div(kGas)
        diff = diff.gte(speed) ? speed : diff
        k = k.minus(diff)
    }
    return new BigNumber(block.baseFeePerGas).times(k).div(10000)
}

export async function getPriorityFeePerGas(rpcUrl: string, block: Block): Promise<ethers.BigNumber> {
    const provider = new providers.JsonRpcProvider(rpcUrl)
    if (!block.baseFeePerGas) {
        console.error(block, 'Block chain not support 1159')
        return ethers.BigNumber.from(0)
    }
    let txIndex = 1
    if (block.transactions.length > 10) {
        txIndex = block.transactions.length - 6
    }
    const txHash = block.transactions[txIndex]
    const tx = await provider.getTransaction(txHash)

    console.log(`GetTransaction Length ${block.transactions.length}, index ${txIndex}`)

    if (tx.type != 2) {
        console.error('Tx not type 2', block.baseFeePerGas.toString(), tx)
        return block.baseFeePerGas.div(2)
    }
    return tx.maxPriorityFeePerGas || ethers.BigNumber.from(6e9)
}

export async function getGas1559Price(rpcUrl: string): Promise<{ maxPriorityFeePerGas: ethers.BigNumber, maxFeePerGas: ethers.BigNumber }> {
    const provider = new providers.JsonRpcProvider(rpcUrl)
    // const network = await provider.getNetwork()
    // console.log(network)
    let blockTag = 'pending'
    // if (chainId == 137) {
    //     blockTag = 'latest'
    // }
    const block = await provider.getBlock(blockTag)//pending  latest
    console.log(`block.number ${block.number} gasUsed ${block.gasUsed} gasLimit ${block.gasLimit} baseFeePerGas ${block.baseFeePerGas}`)
    if (!block.baseFeePerGas) {
        console.error(provider.network.chainId, 'Block not support 1559')
        return {maxPriorityFeePerGas: ethers.BigNumber.from('0'), maxFeePerGas: ethers.BigNumber.from('0')}
    }
    const maxPriorityFee = await provider.send('eth_maxPriorityFeePerGas', [])
    console.log(ethers.BigNumber.from(maxPriorityFee).div(1e9).toString())

    const priorityFee = ethers.BigNumber.from(maxPriorityFee)//await getPriorityFeePerGas(block, provider)
    const baseFee = getBaseFeePerGas(block)
    console.log(`maxPriorityFeePerGas:${priorityFee} ->${priorityFee.div(1e9)}, 
  maxFeePerGas:${baseFee}->${baseFee.div(1e9)} ->${baseFee.add(priorityFee).div(1e9)}`)
    return {maxPriorityFeePerGas: priorityFee, maxFeePerGas: baseFee.add(priorityFee)}
}


export async function getFeeData(signer: Signer): Promise<{ maxFeePerGas: string, maxPriorityFeePerGas: string, gasPrice: string }> {
    const fee = await signer.getFeeData()
    const maxFeePerGas = ethers.utils.formatUnits(fee.maxFeePerGas || 1, 'gwei')
    const maxPriorityFeePerGas = ethers.utils.formatUnits(fee.maxPriorityFeePerGas || 1, 'gwei')
    const gasPrice = ethers.utils.formatUnits(fee.gasPrice || 1, 'gwei')
    return {maxFeePerGas, maxPriorityFeePerGas, gasPrice}
}

// BaseGasPrice = PreviousBaseGasPrice × (1 + k × CongestionLevel)
export async function getGas1559PriceBak(rpcUrl: string): Promise<{ maxPriorityFeePerGas: string, maxFeePerGas: string }> {
    const chain = new providers.JsonRpcProvider(rpcUrl)
    // @ts-ignore
    const block = await chain.getBlock('latest') // rpcProvider.getBlock();
    const fee = await chain.getFeeData()
    console.log(`FeeData maxFeePerGas ${fee.maxFeePerGas?.div(1e9)} maxPriorityFeePerGas ${fee.maxPriorityFeePerGas?.div(1e9)} gasPrice ${fee.gasPrice?.div(1e9)}`)

    const chainId = 'x'
    console.log(`ChainID ${chainId} block.number:${block.number},
   gasLimit: ${block.gasLimit.div(1e4)};  block.gasUsed ${block.gasUsed.div(1e4)} baseFeePerGas ${block.baseFeePerGas?.div(1e9)},
   exp ${block.gasLimit.sub(block.gasUsed).div(1e4)} `)
    if (!block.baseFeePerGas) {
        console.error(chainId, 'Block not support 1159')
        return {maxPriorityFeePerGas: '0', maxFeePerGas: '0'}
    }

    const priorityFee = await getPriorityFeePerGas(rpcUrl, block)
    console.log(`priorityFee:${priorityFee.div(1e9)}`)

    const baseFee = getBaseFeePerGas(block)
    console.log(`baseFee:${baseFee.div(1e9)}`)

    const feePerGas = baseFee//!(block.gasUsed.gt(block.gasLimit.div(2))) ? block.baseFeePerGas : block?.baseFeePerGas?.mul(2).add(maxPriorityFeePerGas)
    const maxFeePerGas = feePerGas?.lt(1e9) ? ethers.BigNumber.from(2e9) : feePerGas || ethers.BigNumber.from('0')
    const maxPriorityFeePerGas = maxFeePerGas.div(10) || ethers.BigNumber.from('0')
    console.log(`maxFeePerGas ${maxFeePerGas.div(1e9)} maxPriorityFeePerGas ${maxPriorityFeePerGas.div(1e9)}`)
    return {maxPriorityFeePerGas: maxPriorityFeePerGas.toString(), maxFeePerGas: maxFeePerGas?.toString()}
}
