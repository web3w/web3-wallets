import {ethers, providers, Signer} from "ethers";
import {get1559Fee} from "./fee";
import {Block, FeeData, TransactionRequest, Provider, TransactionResponse} from '@ethersproject/abstract-provider'
import {LimitedCallSpec, WalletInfo} from "../types";
import {getProvider} from "./provider";
import BigNumber from "bignumber.js";


// https://docs.alchemy.com/alchemy/apis/ethereum/eth-blocknumber
export async function getFeeHistory(rpcUrl: string, blockRange: number, percentiles: number[]) {
    const feeHistory = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_feeHistory",
        "params": [blockRange, "latest", percentiles]
    }
    const feeHistoryRes = await ethers.utils.fetchJson(rpcUrl, JSON.stringify(feeHistory))
    return feeHistoryRes.result
    // console.log(Number(feeHistoryRes.result.oldestBlock))
}

export async function getBlockNumber(rpcUrl: string, blockRange: number, percentiles: number[]) {
    const blockNumber = `{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":0}`
    const blockNumberRes = await ethers.utils.fetchJson(rpcUrl, blockNumber)
    // console.log(Number(blockNumberRes.result))
    return blockNumberRes.result
}


export async function getEstimateGas(rpcUrl: string, callData: LimitedCallSpec) {
    if (callData.value && callData.value.toString().substr(0, 2) != '0x') {
        callData.value = '0x' + Number(callData.value.toString()).toString(16)
    }
    const estimate = {
        "jsonrpc": "2.0",
        "method": "eth_estimateGas",
        "params": [callData, 'latest'],
        "id": 1
    }
    const blockNumberRes = await ethers.utils.fetchJson(rpcUrl, JSON.stringify(estimate))
    // console.log('getEstimateGas result', blockNumberRes.result)
    if (blockNumberRes.result) {
        return Number(blockNumberRes.result).toString()
    } else {
        throw blockNumberRes.error
    }
}


export async function ethSendGas(wallet: WalletInfo, callData: LimitedCallSpec): Promise<TransactionResponse> {
    const {walletSigner, rpc} = getProvider(wallet)
    let value = ethers.BigNumber.from(0)
    if (callData.value) {
        value = ethers.BigNumber.from(callData.value)
    }
    const transactionObject = {
        to: callData.to,
        data: callData.data,
        value
    }

    try {
        const tx = await walletSigner.populateTransaction(transactionObject).catch(async (error: any) => {
            throw error
        })
        console.log('EthSend tx.type', tx.type, 'tx.value', tx.value?.toString(), 'gasPrice', tx.gasPrice?.toString(), 'gasLimit', tx.gasLimit?.toString())
        let signTx = {...tx}
        if (tx.type == 2) {
            const fee = await get1559Fee(rpc)
            signTx.maxFeePerGas = ethers.BigNumber.from(fee.maxFeePerGas) //?.mul(gasPriceOffset).div(100).toNumber()
            signTx.maxPriorityFeePerGas = ethers.BigNumber.from(fee.maxPriorityFeePerGas) //?.mul(gasPriceOffset).div(100).toNumber()
        }
        return walletSigner.sendTransaction(signTx).catch((e: any) => {
            throw e
        })
    } catch (e: any) {
        throw e
    }
}

export async function ethSendGasLimit(wallet: WalletInfo, callData: LimitedCallSpec, gasLimit: string): Promise<TransactionResponse> {
    const offsetRatio = wallet.offsetGasLimitRatio || 1
    const offsetGasLimit = new BigNumber(gasLimit).times(offsetRatio).toFixed(0)
    const {walletSigner, rpc} = getProvider(wallet)
    let value = ethers.BigNumber.from(0)
    if (callData.value) {
        value = ethers.BigNumber.from(callData.value)
    }

    const transactionObject = {
        from: wallet.address,
        to: callData.to,
        data: callData.data,
        gasLimit: ethers.BigNumber.from(offsetGasLimit),
        value
    } as TransactionRequest

    console.log('value', value.toString(), 'gasLimit', transactionObject.gasLimit?.toString(),)

    if (wallet.isSetGasPrice) {
        const tx = await walletSigner.populateTransaction(transactionObject).catch(async (error: any) => {
            throw error
        })
        if (tx?.type == 2) {
            const fee = await get1559Fee(rpc)
            transactionObject.maxFeePerGas = ethers.BigNumber.from(fee.maxFeePerGas) //?.mul(gasPriceOffset).div(100).toNumber()
            transactionObject.maxPriorityFeePerGas = ethers.BigNumber.from(fee.maxPriorityFeePerGas) //?.mul(gasPriceOffset).div(100).toNumber()
        } else {
            const fee = await walletSigner.getFeeData()
            const gasPrice = ethers.utils.formatUnits(fee.gasPrice || 5, 'gwei')
            console.log("gasPrice", gasPrice)
            transactionObject.gasPrice = ethers.BigNumber.from(gasPrice)
        }
    }

    console.log('value', value.toString(), 'gasLimit', transactionObject.gasLimit?.toString(),)

    return walletSigner.sendTransaction(transactionObject).catch((e: any) => {
        throw e
    })
}

export async function ethSend(wallet: WalletInfo, callData: LimitedCallSpec): Promise<TransactionResponse> {
    const {walletSigner, rpc} = getProvider(wallet)
    let value = ethers.BigNumber.from(0)
    if (callData.value) {
        value = ethers.BigNumber.from(callData.value)
    }
    const transactionObject = {
        from: wallet.address,
        to: callData.to,
        data: callData.data,
        value
    } as TransactionRequest

    if (wallet.isSetGasPrice) {
        const tx = await walletSigner.populateTransaction(transactionObject).catch(async (error: any) => {
            throw error
        })
        if (tx?.type == 2) {
            const fee = await get1559Fee(rpc)
            transactionObject.maxFeePerGas = ethers.BigNumber.from(fee.maxFeePerGas) //?.mul(gasPriceOffset).div(100).toNumber()
            transactionObject.maxPriorityFeePerGas = ethers.BigNumber.from(fee.maxPriorityFeePerGas) //?.mul(gasPriceOffset).div(100).toNumber()
        } else {
            const fee = await walletSigner.getFeeData()
            const gasPrice = ethers.utils.formatUnits(fee.gasPrice || 5, 'gwei')
            console.log("gasPrice", gasPrice)
            transactionObject.gasPrice = ethers.BigNumber.from(gasPrice)
        }
    }

    try {
        return walletSigner.sendTransaction(transactionObject).catch((e: any) => {
            throw e
        })
    } catch (e: any) {
        throw e
    }
}
