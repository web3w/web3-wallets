import {Web3Wallets} from "../../src/index";
import {WalletNames} from "../../src/types";
import secrets from '../../../../secrets.json'
import {ProxyWallet} from "../../src/connectors/proxyWallet";
import {ethers} from "ethers";

const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';
(async () => {
    // const wallet = new Web3Wallets(WalletNames.ProxyWallet, {priKey: secrets.accounts[seller]})
    const wallet = new ProxyWallet({address: seller, chainId: 4, priKey: secrets.accounts[seller]})
    const addressList = await wallet.enable()
    console.log(addressList)
})()
