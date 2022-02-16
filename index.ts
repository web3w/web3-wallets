export {ethers} from 'ethers'
export {ConnectWallet, MetaMaskWallet, getWalletConnectProvider} from './src'

export const CHAIN_ID_RPC: { [chainId: number]: string } = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed1.defibit.io/', // BSC
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545', //BSC TEST
    137: 'https://rpc-mainnet.maticvigil.com', // Polygen
    80001: 'https://rpc-mumbai.matic.today'
}
