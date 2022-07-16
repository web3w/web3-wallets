import {Contract} from "web3-wallets";

export const wethContract = (wallet) => {
    const wethAbi = [{
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }]

    const {walletSigner} = wallet
    const chainId = wallet.chainId
    // WETH
    let wethAddress;
    if (chainId === 1) { // eth
        wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    } else if (chainId === 4) { // rinkeby
        wethAddress = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
    } else if (chainId === 56) { // bsc
        wethAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    } else if (chainId === 97) { // bsc_testnet
        wethAddress = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
    } else if (chainId === 137) { // polygon
        wethAddress = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';
    } else {
        throw Error("Unknow chain=" + chainId);
    }
    console.log('weth : ' + wethAddress);
    return new Contract(wethAddress, wethAbi, walletSigner)

}
