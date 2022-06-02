import {ethers, providers, Signer} from "ethers";
import {Web3Wallets} from "../index";
import {WalletNames, WalletInfo, JsonRpcRequest} from "../types";
import {getChainInfo} from "./rpc";
import {RPC_API_TIMEOUT} from "../constants";

import Fastify, {FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest} from 'fastify'
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';


// import Helmet from 'fastify-helmet'
//@fastify/helmet

import pkg from '../../package.json'

export function detectWallets() {
    let metamask: Web3Wallets | undefined
    if (typeof window === 'undefined') {
        throw "evn not sprot"
        // console.warn('not signer fo walletProvider')
    }
    if (window.ethereum) {
        const walletProvider = window.ethereum
        // if (walletProvider.overrideIsMetaMask) {
        //     this.provider = walletProvider.provider.providers.find(val => val.isMetaMask)
        // }

        if (walletProvider.isMetaMask) {
            metamask = new Web3Wallets(WalletNames.Metamask)
        }
    }
    const coinbase = new Web3Wallets(WalletNames.Coinbase)
    const walletconnect = new Web3Wallets(WalletNames.WalletConnect)
    return {metamask, coinbase, walletconnect}

}

export function getProvider(walletInfo: WalletInfo) {
    const {timeout, chainId, address, priKey, rpcUrl} = walletInfo
    const rpc = rpcUrl || getChainInfo(chainId).rpcs[0]
    const url = {url: rpc, timeout: timeout || RPC_API_TIMEOUT}
    // const rpcProvider =
    let walletSigner: Signer | undefined, walletProvider: any
    const network = {
        name: walletInfo.address,
        chainId: walletInfo.chainId
    }

    if (priKey) {
        walletSigner = new ethers.Wallet(priKey, new providers.JsonRpcProvider(url, network))
        walletProvider = walletSigner
    } else {
        // walletSigner = rpcProvider.getSigner(address)
        if (typeof window === 'undefined') {
            console.log('getProvider:There are no priKey')
            walletProvider = (new providers.JsonRpcProvider(url, network)).getSigner(address)
            walletSigner = walletProvider
        } else {
            if (window.ethereum && !window.walletProvider || window.ethereum && !window.elementWeb3) {
                console.log('getProvider:ethereum')
                walletProvider = window.ethereum
                if (!window.ethereum.selectedAddress) {
                    window.ethereum.enable()
                }
                walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
            }
            // // console.log('isMetaMask', window.elementWeb3.isMetaMask)
            // if (window.walletProvider) {
            //     console.log('getProvider:walletProvider')
            //     walletProvider = window.walletProvider
            //     walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
            // }

            if (window.elementWeb3) {
                console.log('getProvider:elementWeb3')
                walletProvider = window.elementWeb3
                if (walletProvider.isWalletConnect) {
                    //JsonRpcSigner wallet connect
                    walletSigner = new ethers.providers.Web3Provider(walletProvider).getSigner(address)
                } else {
                    // new Web3()
                    walletSigner = new ethers.providers.Web3Provider(walletProvider.currentProvider).getSigner(address)
                }
            }
        }
    }
    walletSigner = walletSigner || (new providers.JsonRpcProvider(url, network)).getSigner(address)
    return {
        address,
        chainId,
        rpc,
        walletSigner,
        walletProvider
    }
}


export function createProvider(walletInfo: WalletInfo) {
    const {timeout, chainId, address, priKey, rpcUrl} = walletInfo
    const rpc = rpcUrl || getChainInfo(chainId).rpcs[0]
    const url = {url: rpc, timeout: timeout || RPC_API_TIMEOUT}
    const fastify: FastifyInstance = Fastify({
        logger: true
    })

    //optionsSuccessStatus: 200

    fastify.register(
        helmet,
        // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
        { contentSecurityPolicy: false }
    )
    fastify.register(
        cors,
        {
            optionsSuccessStatus:204
        }
    )

    // app.register(addProduct)
    // app.register(Helmet)

    // app.get('/health', (req: FastifyRequest, res: FastifyReply) => {
    //     res.status(204).send()
    // })

    fastify.get('/info', (req: FastifyRequest, res: FastifyReply) => {
        res.status(200).send({
            name: pkg.name,
            description: pkg.description,
            version: pkg.version
        })
    })

    //RPC
    // let methods = [
    //     // "eth_getBalance",
    //     "eth_accounts",
    //     // "eth_blockNumber",
    //     "eth_getBlockByNumber",
    //     "net_version",
    //     "eth_call",
    //     "eth_getTransactionReceipt"
    // ]

    fastify.all('/', async (req: FastifyRequest, res: FastifyReply) => {
        console.log("allll", req.headers.origin)

        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Methods", "*");
        //
        // //{ success: true }
        // if (req.method == "OPTIONS") {
        //     res.status(200).send()
        // }


    })


    fastify.post('/', async (req: FastifyRequest, res: FastifyReply) => {
        console.log("post", req.body)
        if (!req.body || typeof req.body !== 'object') {
            res.status(400).send({
                message: 'Error: missing or invalid request body'
            })
        }
        // @ts-ignore
        const {id, params, method} = <JsonRpcRequest>req.body


        if (!method || typeof method !== 'string') {
            res.status(400).send({
                message: 'Error: missing or invalid topic field'
            })
        }
        if (!params || typeof params !== "object") {
            res.status(400).send({
                message: 'Error: missing or invalid webhook field'
            })
        }

        if (method === "eth_sendTransaction") {
            console.log(req.url + ", rpc:" + JSON.stringify(req.body))
            let txCode: any = params[0]
            if (!priKey) throw new Error("PriKey undefind")
            const wallet = new ethers.Wallet(priKey)
            const receipt = await wallet.signTransaction(txCode)
            const data = {jsonrpc: '2.0', id, result: receipt}
            res.status(200).send(data)

        }


        if (method === "eth_sendRawTransaction") {
            console.log("eth_sendRawTransaction", params)
            // params[0].from = walletInfo.address
        }

        //
        // ||

        if (method == "eth_accounts") {
            res.status(200).send([address])
        } else {
            const data = await ethers.utils.fetchJson(url, JSON.stringify(req.body))
            if (method === "eth_getBalance") {

            } else if (
                method === "eth_blockNumber"
                || method === "eth_chainId"
                || method === "eth_gasPrice"
                || method === "eth_getTransactionCount") {
                console.log(method, data.id, parseInt(data.result), data.result)
            } else if (method === "eth_getBlockByNumber") {
                const {number, gasUsed, baseFeePerGas} = data.result
                console.log(method, parseInt(number), parseInt(gasUsed), parseInt(baseFeePerGas))
            } else if (method === "eth_call") {

            } else if (method === "eth_getCode") {
                //
            } else {
                console.log("-----------", id, method, data)
            }
            if (data.error) {
                console.log(req.body)
                console.log(method, data.error)
            }
            res.status(200).send(data)
        }

    })


    fastify.ready(() => {
        // 将 ws 服务绑定到 app 中
        console.log("ready")
    })
    return fastify
}
