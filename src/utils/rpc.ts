import {ethers, providers, Signer} from "ethers";
import {get1559Fee} from "./fee";
import {TransactionResponse} from "@ethersproject/abstract-provider";
import {Web3Wallets} from "../index";
import {ProviderNames} from "../types";
import {getProvider, WalletInfo} from "./provider";


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


export interface LimitedCallSpec {
    to: string
    data: string
    value?: string
    from?: string
}

export async function getEstimateGas(rpcUrl: string, callData: LimitedCallSpec) {
    if (callData.value && callData.value.substr(0, 2) != '0x') {
        callData.value = '0x' + Number(callData.value).toString(16)
    }
    const estimate = {
        "jsonrpc": "2.0",
        "method": "eth_estimateGas",
        "params": [callData, 'latest'],
        "id": 1
    }
    const blockNumberRes = await ethers.utils.fetchJson(rpcUrl, JSON.stringify(estimate))
    console.log('getEstimateGas result', blockNumberRes.result)
    if (blockNumberRes.result) {
        return Number(blockNumberRes.result).toString()
    } else {
        throw blockNumberRes.error
    }
}


export async function ethSend(wallet: WalletInfo, callData: LimitedCallSpec): Promise<TransactionResponse> {
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
