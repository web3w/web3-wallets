import {Asset, ethSend, getEstimateGas, UserAccount} from "../index";
import * as secrets from '../../../secrets.json'
import {asset721, asset1155, erc20Tokens} from "./assets";
import {ethers} from "ethers";

// const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';
const seller = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
(async () => {
    const chainId = 97
    const erc721 = asset721[chainId][0] as Asset
    const erc1155 = asset1155[chainId][0] as Asset
    const user = new UserAccount({
        chainId,
        address: seller,
        priKey: secrets.accounts[seller]
    })

    const tokenAddr = user.GasWarpperToken.address
    const erc20Decimals = await user.getERC20Decimals(tokenAddr)
    const erc20Allowance = await user.getERC20Allowance(tokenAddr,seller)
    const erc20Approve = await user.approveErc20Proxy(tokenAddr,seller,"200")
    await erc20Approve.wait()
    const erc20allowance200 = await user.getERC20Allowance(tokenAddr,seller)

    const bal20 = await user.getERC20Balances(user.GasWarpperToken.address)

    console.log(bal20)
    const wethBal = ethers.utils.formatUnits(bal20).toString()
    const wethWithdrawTx = await user.wethWithdraw(wethBal)
    await wethWithdrawTx.wait()

    const wethDepositTx = await user.wethDeposit(wethBal)
    await wethDepositTx.wait()

    const bal721 = await user.getAssetBalances(erc721)
    await user.cancelErc721Approve(erc721.tokenAddress, seller)
    const bal1155 = await user.getAssetBalances(erc1155)
    console.log(bal721, bal1155)


})()
