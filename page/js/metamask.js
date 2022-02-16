export class MetamaskWallet {
  constructor() {
    this.ethereum = window.ethereum
    if (window.ethereum) {
      this.chainId = +window.ethereum.chainId
    } else {
      throw 'Please install wallet'
    }
  }

  async requestAccounts() {
    const accountList = await window.ethereum.request({ method: 'eth_requestAccounts' }) // enable ethereum

    this.account = accountList[0]
    return accountList
  }

  async switchEthereumChain(chainId, rpcUrl) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId, rpcUrl }]
          })
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  async switchBSCTEST() {
    const rpcUrl="https://data-seed-prebsc-1-s1.binance.org:8545"
    await this.switchEthereumChain('0x61',)
  }

  async switchBSC() {
    const rpcUrl="https://bsc-dataseed1.defibit.io/"
    await this.switchEthereumChain('0x38',)
  }

  async switchRinkeby() {
    const rpcUrl="https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    await this.switchEthereumChain('0x4',rpcUrl)
  }


}
