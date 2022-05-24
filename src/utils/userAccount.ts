import {ethers, providers,} from 'ethers'
import {ContractBase} from './contracts/index'
import {LimitedCallSpec, NULL_ADDRESS, WalletInfo, ETH_TOKEN_ADDRESS, EIP712TypedData} from "../types";
import {Asset, ElementSchemaName, ExchangeMetadata, Token} from "../agentTypes";
import {PopulatedTransaction} from "@ethersproject/contracts";
import {getProvider} from "./provider";
import {Bytes} from "@ethersproject/bytes";

export function assetToMetadata(asset: Asset, quantity: string = "1", data?: string): ExchangeMetadata {
    return <ExchangeMetadata>{
        asset: {
            id: asset.tokenId,
            address: asset.tokenAddress,
            quantity,
            data
        },
        schema: asset.schemaName
    }
}

export function metadataToAsset(metadata: ExchangeMetadata, data?: Asset): Asset {
    return <Asset>{
        ...data,
        tokenId: metadata.asset.id,
        tokenAddress: metadata.asset.address,
        schemaName: metadata.schema
    }
}

export function tokenToAsset(token: Token): Asset {
    return <Asset>{
        tokenId: undefined,
        tokenAddress: token.address,
        schemaName: 'ERC20',
        decimals: token.decimals
    }
}

export function tokenToMetadata(token: Token, quantity: string = "1", data?: string): ExchangeMetadata {
    return <ExchangeMetadata>{
        asset: {
            id: undefined,
            address: token.address,
            quantity,
            data
        },
        schema: 'ERC20'
    }
}

export function transactionToCallData(data: PopulatedTransaction): LimitedCallSpec {
    return {
        from: data.from,
        to: data.to,
        data: data.data,
        value: data.value
    } as LimitedCallSpec
}


export class UserAccount extends ContractBase {
    constructor(wallet: WalletInfo) {
        super(wallet)
    }

    public async signMessage(message: Bytes | string): Promise<any> {
        const {walletSigner} = getProvider(this.walletInfo)
        if (ethers.utils.isHexString(message)) {
            message = ethers.utils.arrayify(message)
        }
        const signature = await walletSigner.signMessage(message).catch((error: any) => {
            this.emit('SignMessage', error)
            throw error
        })

        if (typeof signature != 'string') throw "SignMessage error"
        const pubAddress = ethers.utils.verifyMessage(message, signature)
        console.assert(pubAddress.toLowerCase() == this.walletInfo.address.toLowerCase(), 'Sign message error')
        return {message, signature}
    }

    public async signTypedData(typedData: EIP712TypedData): Promise<any> {
        const {walletProvider, walletSigner} = getProvider(this.walletInfo)
        const types = typedData.types
        if (types.EIP712Domain) {
            delete types.EIP712Domain
        }
        let signature: string
        // if (walletProvider.isWalletConnect) {
        //     const walletSigner = new providers.Web3Provider(walletProvider).getSigner()
        //     signature = await walletSigner._signTypedData(typedData.domain, {Order: typedData.types.Order}, typedData.message)
        // }
        signature = await (<any>walletSigner)._signTypedData(typedData.domain, typedData.types, typedData.message).catch((error: any) => {
            this.emit('SignTypedData', error)
            throw error
        })

        const pubAddress = ethers.utils.verifyTypedData(typedData.domain, typedData.types, typedData.message, signature)
        const msg = `VerifyTypedData error ${pubAddress} ${this.walletInfo.address}`
        console.assert(pubAddress.toLowerCase() == this.walletInfo.address.toLowerCase(), msg)
        return {
            signature,
            typedData
        }
    }

    public async approveErc20ProxyCalldata(tokenAddr: string, spender: string, allowance?: string): Promise<LimitedCallSpec> {
        const quantity = allowance || ethers.constants.MaxInt256.toString() //200e18.toString() //
        const erc20 = this.getContract(tokenAddr, this.erc20Abi)
        const data = await erc20.populateTransaction.approve(spender, quantity)
        return transactionToCallData(data)
    }

    public async approveErc20Proxy(tokenAddr: string, spender: string, allowance?: string) {
        const callData = await this.approveErc20ProxyCalldata(tokenAddr, spender, allowance)
        return this.ethSend(callData)
    }

    public async cancelErc20Approve(tokenAddr: string, operator: string) {
        const callData = await this.approveErc20ProxyCalldata(tokenAddr, operator, "1")
        return this.ethSend(callData)
    }

    public async approveErc721ProxyCalldata(tokenAddr: string, operator: string, isApprove = true): Promise<LimitedCallSpec> {
        const erc721 = this.getContract(tokenAddr, this.erc721Abi)
        const data = await erc721.populateTransaction.setApprovalForAll(operator, isApprove)
        return transactionToCallData(data)

    }

    public async approveErc721Proxy(tokenAddr: string, operator: string) {
        const callData = await this.approveErc721ProxyCalldata(tokenAddr, operator)
        return this.ethSend(callData)
    }

    public async cancelErc721Approve(tokenAddr: string, operator: string) {
        const callData = await this.approveErc721ProxyCalldata(tokenAddr, operator, false)
        return this.ethSend(callData)
    }

    public async approveErc1155ProxyCalldata(tokenAddr: string, operator: string, isApprove = true) {
        const erc1155 = this.getContract(tokenAddr, this.erc1155Abi)
        const data = await erc1155.populateTransaction.setApprovalForAll(operator, isApprove)
        return transactionToCallData(data)
    }

    public async approveErc1155Proxy(tokenAddr: string, operator: string) {
        const calldata = await this.approveErc1155ProxyCalldata(tokenAddr, operator)
        return this.ethSend(calldata)
    }

    public async cancelErc1155Approve(tokenAddr: string, operator: string) {
        const callData = await this.approveErc1155ProxyCalldata(tokenAddr, operator, false)
        return this.ethSend(callData)
    }

    public async getGasBalances(account?: { address?: string, rpcUrl?: string }): Promise<string> {
        const {address, rpcUrl} = account || {}
        const owner = address || this.signerAddress
        let provider: any = this.signer
        let rpc = rpcUrl || this.walletInfo.rpcUrl
        let ethBal = '0'
        if (rpcUrl) {
            const network = {
                name: owner,
                chainId: this.walletInfo.chainId
            }
            provider = new providers.JsonRpcProvider(rpc, network)
        }
        if (owner && ethers.utils.isAddress(owner)) {
            if (rpcUrl) {
                // ethBal = (await provider.getBalance(this.walletInfo.address)).toString()
                const ethStr = await provider.send('eth_getBalance', [owner, 'latest'])
                ethBal = parseInt(ethStr).toString()
            } else {
                const ethStr = (await provider.provider.send('eth_getBalance', [owner, 'latest']))
                ethBal = parseInt(ethStr).toString()

            }
        }
        return ethBal
    }

    public async getTokenBalances({
                                      tokenAddr,
                                      account,
                                      rpcUrl
                                  }: { tokenAddr: string, account?: string, rpcUrl?: string }): Promise<string> {
        const owner = account || this.signerAddress
        let provider: any = this.signer
        let erc20Bal = '0'
        let rpc = rpcUrl || this.walletInfo.rpcUrl
        if (rpcUrl) {
            const network = {
                name: owner,
                chainId: this.walletInfo.chainId
            }
            provider = new providers.JsonRpcProvider(rpc, network)
        }
        if (tokenAddr
            && ethers.utils.isAddress(tokenAddr)
            && tokenAddr != NULL_ADDRESS
            && tokenAddr.toLowerCase() != ETH_TOKEN_ADDRESS.toLowerCase()) {

            const erc20 = this.getContract(tokenAddr, this.erc20Abi)
            if (rpcUrl) {
                // erc20Bal = await erc20.connect(provider).balanceOf(owner)
                const callData = await erc20.populateTransaction.balanceOf(owner)
                const erc20Str = await provider.send('eth_call', [callData, 'latest'])
                erc20Bal = parseInt(erc20Str).toString()
            } else {
                erc20Bal = await erc20.balanceOf(owner)
            }
        }
        return erc20Bal
    }

    public async getERC20Balances(erc20Addr: string, account?: string): Promise<string> {
        const owner = account || this.signerAddress
        const erc20 = this.getContract(erc20Addr, this.erc20Abi)
        const result = await erc20.balanceOf(owner)
        return result.toString()
    }

    public async getERC20Allowance(erc20Addr: string, spender: string, account?: string): Promise<string> {
        const owner = account || this.signerAddress
        const erc20 = this.getContract(erc20Addr, this.erc20Abi)
        const result = await erc20.allowance(owner, spender)
        return result.toString()
    }

    public async getERC20Decimals(erc20Addr: string): Promise<string> {
        const erc20 = this.getContract(erc20Addr, this.erc20Abi)
        const result = await erc20.decimals()
        return result.toString()
    }


    public async getERC721Balances(to: string, tokenId: string, account?: string): Promise<string> {
        const checkAddr = account || this.signerAddress
        const owner = await this.getERC721OwnerOf(to, tokenId)
        return checkAddr.toLowerCase() === owner.toLowerCase() ? '1' : '0'
    }

    public async getERC721OwnerOf(to: string, tokenId: string): Promise<string> {
        const erc721 = this.getContract(to, this.erc721Abi)
        return erc721.ownerOf(tokenId)
    }

    public async getERC721Allowance(to: string, operator: string, account?: string): Promise<boolean> {
        const owner = account || this.signerAddress
        const erc721 = this.getContract(to, this.erc721Abi)
        return erc721.isApprovedForAll(owner, operator)
    }

    public async getERC1155Balances(to: string, tokenId: string, account?: string): Promise<string> {
        const owner = account || this.signerAddress
        const erc1155 = this.getContract(to, this.erc1155Abi)
        const result = await erc1155.balanceOf(owner, tokenId)
        return result.toString()
    }

    public async getERC1155Allowance(to: string, operator: string, account?: string): Promise<boolean> {
        const owner = account || this.signerAddress
        const erc1155 = this.getContract(to, this.erc1155Abi)
        return erc1155.isApprovedForAll(owner, operator)
    }

    public async getAssetApprove(asset: Asset, operator: string, account?: string)
        : Promise<{ isApprove: boolean, balances: string, calldata: LimitedCallSpec | undefined }> {
        const owner = account || this.signerAddress
        let isApprove = false, balances = '0', calldata
        const tokenAddr = asset.tokenAddress
        const tokenId = asset.tokenId || '0'
        if (asset.schemaName == ElementSchemaName.ERC721) {
            isApprove = await this.getERC721Allowance(tokenAddr, operator, owner)
            calldata = isApprove ? undefined : await this.approveErc721ProxyCalldata(tokenAddr, operator)
            balances = await this.getERC721Balances(tokenAddr, tokenId, owner)
        } else if (asset.schemaName == ElementSchemaName.ERC1155) {
            isApprove = await this.getERC1155Allowance(tokenAddr, operator, owner)
            calldata = isApprove ? undefined : await this.approveErc1155ProxyCalldata(tokenAddr, operator)
            balances = await this.getERC1155Balances(tokenAddr, tokenId, owner)
        }
        return {
            isApprove,
            balances,
            calldata
        }
    }

    public async getTokenApprove(tokenAddr: string, spender: string, account?: string)
        : Promise<{ allowance: string, balances: string, calldata: LimitedCallSpec }> {
        const owner = account || this.signerAddress
        if (ethers.utils.isAddress(tokenAddr)
            && tokenAddr != NULL_ADDRESS
            && tokenAddr.toLowerCase() != ETH_TOKEN_ADDRESS.toLowerCase()) {
            const allowance = await this.getERC20Allowance(tokenAddr, spender, owner)
            const balances = await this.getERC20Balances(tokenAddr, owner)
            const calldata = await this.approveErc20ProxyCalldata(tokenAddr, spender)
            return {
                allowance,
                balances,
                calldata
            }
        } else {
            throw 'User Account GetTokenApprove error'
        }
    }

    public async assetApprove(asset: Asset, operator: string) {
        const tokenAddr = asset.tokenAddress
        if (asset.schemaName == ElementSchemaName.ERC721) {
            return this.approveErc721Proxy(tokenAddr, operator)
        } else if (asset.schemaName == ElementSchemaName.ERC1155) {
            return this.approveErc1155Proxy(tokenAddr, operator)
        } else {
            throw 'assetApprove error'
        }
    }

    public async getAssetBalances(asset: Asset, account?: string) {
        const owner = account || this.signerAddress
        let balances = '0'
        const tokenAddr = asset.tokenAddress
        const tokenId = asset.tokenId || '0'
        if (asset.schemaName == ElementSchemaName.ERC721) {
            balances = await this.getERC721Balances(tokenAddr, tokenId, owner)
        } else if (asset.schemaName == ElementSchemaName.ERC1155) {
            balances = await this.getERC1155Balances(tokenAddr, tokenId, owner)
        } else if (asset.schemaName == ElementSchemaName.ERC20) {
            balances = await this.getERC20Balances(tokenAddr, tokenId)
        }
        return balances
    }

    public async assetTransfer(metadata: ExchangeMetadata, to: string) {
        const from = this.signerAddress
        const assetQ = metadataToAsset(metadata)
        const balance = await this.getAssetBalances(assetQ, from)

        const {asset, schema} = metadata
        const {address, quantity, data, id} = asset

        if (Number(quantity || 1) > Number(balance)) {
            throw 'Asset balances not enough'
        }

        const tokenId = id
        let calldata
        if (schema === ElementSchemaName.ERC721) {
            const erc721 = this.getContract(address, this.erc721Abi)
            // const gas = await erc721.estimateGas.safeTransferFrom(from, to, tokenId)
            calldata = await erc721.populateTransaction.safeTransferFrom(from, to, tokenId)
        }

        if (schema === ElementSchemaName.CryptoKitties) {
            const erc721 = this.getContract(address, this.erc721Abi)
            calldata = await erc721.populateTransaction.transferFrom(from, to, tokenId)
        }

        if (schema === ElementSchemaName.ERC1155) {
            const erc1155 = this.getContract(address, this.erc1155Abi)
            // const gas = await erc1155.estimateGas.safeTransferFrom(from, to, tokenId, quantity, data || '0x')
            calldata = await erc1155.populateTransaction.safeTransferFrom(from, to, tokenId, quantity, data || '0x')
        }

        if (schema === ElementSchemaName.ERC20) {
            const erc20 = this.getContract(address, this.erc20Abi)
            calldata = await erc20.populateTransaction.safeTransferFrom(from, to, quantity)
        }
        if (!calldata) throw schema + 'asset transfer error'
        return this.ethSend(calldata)
    }

    public async transfer(params: { asset: Asset, quantity: string, to: string, from?: string }) {
        const {asset, quantity, to} = params
        const metadata = assetToMetadata(asset, quantity)
        return this.assetTransfer(metadata, to)
    }

    public async getUserTokenBalance(token: {
        tokenAddr?: string,
        decimals?: number,
        account?: string,
        rpcUrl?: string
    }): Promise<{
        ethBal: number
        ethValue: string
        erc20Bal: number
        erc20Value: string
    }> {
        const {tokenAddr, account, rpcUrl} = token
        const decimals = token.decimals || 18

        const ethBal = !account ? "0" : await this.getGasBalances({address:account, rpcUrl})
        const erc20Bal = !tokenAddr ? "0" : await this.getTokenBalances({
            tokenAddr,
            account,
            rpcUrl
        })
        // const {erc20Bal, ethBal} = await this.userAccount.getAccountBalance({account, tokenAddr, rpcUrl})
        return {
            ethBal: Number(ethBal),
            ethValue: ethers.utils.formatEther(ethBal),
            erc20Bal: Number(erc20Bal),
            erc20Value: ethers.utils.formatUnits(erc20Bal, decimals)
        }
    }

    public async wethWithdraw(ether: string) {
        const wad = ethers.utils.parseEther(ether)
        const data = await this.GasWarpperContract.populateTransaction.withdraw(wad)
        return this.ethSend(transactionToCallData(data))
    }

    public async wethDeposit(ether: string, depositFunc?: false) {
        const wad = ethers.utils.parseEther(ether)
        let callData = {
            to: this.GasWarpperContract.address,
            value: wad.toString()
        } as LimitedCallSpec
        if (depositFunc) {
            callData = transactionToCallData(await this.GasWarpperContract.populateTransaction.deposit(wad))
        }
        return this.ethSend(callData)
    }
}



