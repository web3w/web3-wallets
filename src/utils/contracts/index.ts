import EventEmitter from 'events'
import {ethers, Signer, ContractInterface, Contract} from 'ethers'
import {RPC_PUB_PROVIDER, WalletInfo} from "../../types";
import {getProvider} from "../provider";
import {ContractABI} from "./abi";

export const MOCK_CONTRACTS_ADDRESSES = {
    1: {
        "ERC721": "0xb18380485f7ba9c23deb729bedd3a3499dbd4449",
        "ERC1155": "0x4Fde78d3C8718f093f6Eb3699e3Ed8d091498dF9",
        "ERC20": ""
    },
    4: {
        "ERC721": "0x5F069e9E7311da572299533B7078859085F7d82C",
        "ERC1155": "0xb6316833725F866f2Aad846DE30A5f50F09E247b",
        "ERC20": "0x68801757CC7987e3888A19EF2E8Eb7d15dBDCDe6"
    },
    56: {
        "ERC721": "0xCA3605ca7cffAA27a8D9a9B7E41bcb3c51e590D9",
        "ERC1155": "0x00FD05B17D884D86b964CEEd8652EfC8333b59Fe",
        "ERC20": ""
    },
    97: {
        "ERC721": "0xCF09Aba56f36a4521094c3bF6A303262636B2e1A",
        "ERC1155": "0x52e325E79820d8547798A2405d595020C75B713a",
        "ERC20": "0x717978fC69c1263Ab118E8A2015BBBb563Ca1EE2"
    },

    137: {
        "ERC721": "0xd077bd42b79eB45F6eC24d025c6025B9749215CE",
        "ERC1155": "0x6c57b71EF74B0B94c42520c09fbBCE1ACcC238A8",
        "ERC20": ""
    },
    80001: {
        "ERC721": "0x3fd9FE18C14155CE9222BD42E13c7ec856A8BB78",
        "ERC1155": "0x7Fed7eD540c0731088190fed191FCF854ed65Efa",
        "ERC20": "0x00dd6D1436899fBbA1acaD3c6E30A85520c1AE3e"
    },
    43114: {
        "ERC721": "0x90259D1416E5AeA964eAC2441aA20e9Fb2D99262",
        "ERC1155": "0xdad95F1Ec9360Ffd5c942592b9A5988172134a35",
        "ERC20": ""
    },
    43113: {
        "ERC721": "0xF12e5F6591b4bd80B56b257e758C9CEBADa2a542",
        "ERC1155": "0x88aF41822C65A64e9614D3784Fa1c99b8a02E5f5",
        "ERC20": "0x5df0d6A56523d49650A2526873C2C055201AA879"
    }

}

export class ContractBase extends EventEmitter {
    public chainId: number
    public readonly signer: Signer
    // public readonly provider: any
    public readonly signerAddress: string
    // public readonly walletSigner: any

    public walletInfo: WalletInfo
    public erc20Abi: any
    public erc721Abi: any
    public erc1155Abi: any
    public Mock721: Contract | undefined
    public Mock1155: Contract | undefined


    constructor(wallet: WalletInfo) {
        super()
        wallet.rpcUrl = wallet.rpcUrl || RPC_PUB_PROVIDER[wallet.chainId]
        this.walletInfo = wallet
        const {address, chainId, walletSigner} = getProvider(wallet)

        this.chainId = chainId
        this.signer = walletSigner
        this.signerAddress = address

        this.erc20Abi = ContractABI.erc20.abi
        this.erc721Abi = ContractABI.erc721.abi
        this.erc1155Abi = ContractABI.erc1155.abi
        const mock = MOCK_CONTRACTS_ADDRESSES[wallet.chainId]
        if (mock) {
            this.Mock721 = this.getContract(mock.ERC721, ContractABI.erc721.abi)
            this.Mock1155 = this.getContract(mock.ERC1155, ContractABI.erc1155.abi)
        }
    }

    getContract(contractAddresses: string, abi: ContractInterface): Contract {
        return new ethers.Contract(contractAddresses, abi, this.signer)
    }

}
