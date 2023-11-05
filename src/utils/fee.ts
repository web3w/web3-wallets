import { ethers, Signer, BrowserProvider, getDefaultProvider } from "ethers";
import { Block } from '@ethersproject/abstract-provider'
import { BigNumber } from "../constants";
import { getFeeHistory } from "./rpc";

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

export async function get1559Fee(rpcURl?: string) {
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
        const tmpFee = new BigNumber(feeHistory.baseFeePerGas[i]);
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


    return { maxPriorityFeePerGas: priorityFee.toFixed(0), maxFeePerGas: maxFee.toFixed(0) }
}
 
 

export async function getFeeData(provider: BrowserProvider): Promise<{ maxFeePerGas: string, maxPriorityFeePerGas: string, gasPrice: string }> {
    const fee = await provider.getFeeData()
    const maxFeePerGas = ethers.formatUnits(fee.maxFeePerGas || 1, 'gwei')
    const maxPriorityFeePerGas = ethers.formatUnits(fee.maxPriorityFeePerGas || 1, 'gwei')
    const gasPrice = ethers.formatUnits(fee.gasPrice || 1, 'gwei')
    return { maxFeePerGas, maxPriorityFeePerGas, gasPrice }
}

