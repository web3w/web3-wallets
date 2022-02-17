const Web3 = require("web3");
const BigNumber = require("bignumber.js")

async function estimateGas(chainId) {
    let web3;
    if (chainId == 1) { // eth
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"));
    } else if (chainId == 4) { // rinkeby
        web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"));
    } else if (chainId == 137) { // polygon
        web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mainnet.g.alchemy.com/v2/XAzYHUohbTi6mQkujk-ckZAwb9powF5e"));
    } else if (chainId == 80001) { // polygon_test
        web3 = new Web3(new Web3.providers.HttpProvider("https://rpc-mumbai.matic.today"));
    } else {
        return Promise.resolve({});
    }

    // new Method({
    //     name: 'estimateGas',
    //     call: 'eth_estimateGas',
    //     params: 1,
    //     inputFormatter: [formatter.inputCallFormatter],
    //     outputFormatter: utils.hexToNumber
    // }),

    // new Method({
    //     name: 'getFeeHistory',
    //     call: 'eth_feeHistory',
    //     params: 3,
    //     inputFormatter: [utils.numberToHex, formatter.inputBlockNumberFormatter, null]
    // }),
    //web3.eth.getFeeHistory(blockRange, startingBlock, percentiles[])
    // 获取最近5个块的fee历史记录，按使用的gas比例采样
    let feeHistory = await web3.eth.getFeeHistory(5, "latest", [25,55] )

    let priorityFeeArray = []
    // 对priority fee是用户付给矿工的小费，这里要取中位数，免得有人给太大把平均数拉上去
    for(let i = 0; i < feeHistory.reward.length; i++ ) {
        for(let j = 0; j < feeHistory.reward[i].length; j++) {
            let tmpFee =  new BigNumber(feeHistory.reward[i][j]);
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
    for(let i = 0; i < feeHistory.baseFeePerGas.length; i++ ) {
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

    // 最终的maxFee, 一定要取整，不能有小数
    let maxFee = baseFee.multipliedBy(1.125).plus(priorityFee).toNumber()

    console.log("maxFee: %s, maxPriorityFee: %s， baseFee: %s", maxFee.toFixed(), priorityFee.toFixed(), baseFee.toFixed())

    return Promise.resolve({
        maxFeePerGas:Web3.utils.toNumber(maxFee.toFixed()),
        maxPriorityFeePerGas:Web3.utils.toNumber(priorityFee.toFixed())
    });
}
