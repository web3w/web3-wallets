import {ethers, providers, Signer} from "ethers";
import {get1559Fee} from "./fee";
import {TransactionResponse} from "@ethersproject/abstract-provider";

export const RPC_PROVIDER = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed1.defibit.io/',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    137: 'https://rpc-mainnet.maticvigil.com',
    80001: 'https://polygon-mumbai.g.alchemy.com/v2/9NqLsboUltGGnzDsJsOq5fJ740fZPaVE'
}


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

export async function getEstimateGas(rpcUrl: string, callData: { to: string, data: string, from?: string, value?: string }) {
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
    return Number(blockNumberRes.result).toString()
}

export async function getBlockNumber(rpcUrl: string, blockRange: number, percentiles: number[]) {
    const blockNumber = `{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":0}`
    const blockNumberRes = await ethers.utils.fetchJson(rpcUrl, blockNumber)
    console.log(Number(blockNumberRes.result))
    return blockNumberRes.result
}


export interface WalletInfo {
    chainId: number;
    address: string;
    exSchema?: string;
    priKey?: string;
    rpcUrl?: string;
}

export interface LimitedCallSpec {
    to: string
    data: string
    value?: string
}

export function getProvider(wallet: WalletInfo) {
    const {chainId, address, priKey, rpcUrl} = wallet
    const rpc = rpcUrl || RPC_PROVIDER[chainId]
    const rpcProvider = new providers.JsonRpcProvider(rpc)

    let walletSigner: Signer, walletProvider: any

    if (priKey) {
        walletSigner = new ethers.Wallet(priKey, rpcProvider)
        walletProvider = walletSigner
        // walletProvider = rpcProvider.getSigner(address)
    } else {
        walletSigner = rpcProvider.getSigner(address) //new ethers.VoidSigner(address, rpcProvider)
        if (typeof window === 'undefined') {
            walletProvider = rpcProvider.getSigner(address)
            // console.warn('not signer fo walletProvider')
        } else {
            if (window.ethereum) {
                walletProvider = window.ethereum
                walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner()
            }
            // console.log('isMetaMask', window.elementWeb3.isMetaMask)
            if (window.elementWeb3 || window.WalletProvider) {
                walletProvider = window.elementWeb3 && window.WalletProvider
                console.log('walletProvider', walletProvider)
                if (walletProvider.isWalletConnect) {
                    walletSigner = new ethers.providers.Web3Provider(window.elementWeb3).getSigner()
                } else {
                    //JsonRpcSigner
                    walletSigner = new ethers.providers.Web3Provider(window.elementWeb3.currentProvider).getSigner()
                }
            }
        }
    }
    return {
        address,
        chainId,
        rpc,
        walletSigner,
        walletProvider
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
        console.log('tx.type', tx.type, 'tx.value', tx.value?.toString(), 'gasPrice', tx.gasPrice?.toString(), 'gasLimit', tx.gasLimit?.toString())
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
