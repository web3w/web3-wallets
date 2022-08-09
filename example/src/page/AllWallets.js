import React from 'react'
import './index.scss'

import { useCallbackAsync } from '@public/hooks'

// import { isImToken, isMathWallet, isTokenPocket, showConnectWallet } from '@public/helper/wallet/helper'

import { ConnectorNames } from '@public/helper/wallet/connectors'
import { onConnectCoinbase } from '@public/helper/wallet/connectors/coinbase'

function swap(a, b, arr) {
  const L = arr.length
  if (a < L && b < L) arr[b] = arr.splice(a, 1, arr[b])[0]
}

const isInWalletBrowser = () => isImToken() || isTokenPocket() || isMathWallet()

export function AllWallets() {

  const walletName ="Metamask"
  const metaMaskHandle = useCallbackAsync(async () => {
    console.log(walletName)
    if (!isMetamaskInstalled()) {
      throw new ComplexError({ code: 3001, message: t('wallet_installWallet', { walletName }) })
    }
    await onConnectMetaMask()
    showConnectWallet(false)
  })
  const coinbaseHandle = useCallbackAsync(async () => {
    await onConnectCoinbase()
    showConnectWallet(false)
  })
  const walletConnectHandle = useCallbackAsync(async () => {
    const isConnect = await onWalletConnect()
    if (isConnect) {
      showConnectWallet(false)
    }
  })

  const imTokenHandle = () => (isImToken() ? metaMaskHandle : walletConnectHandle)
  const tokenPocketHandle = () => (isTokenPocket() ? metaMaskHandle : walletConnectHandle)
  const mathWalletHandle = () => (isMathWallet() ? metaMaskHandle : walletConnectHandle)
  const oneKeyHandle = () => (metaMaskHandle)
  const bitkeepHandle = () => (metaMaskHandle)

  const walletList = [
    {
      name: ConnectorNames.Metamask,
      icon: iconMetamask,
      onClick: metaMaskHandle
    },
    {
      name: ConnectorNames.Coinbase,
      icon: coinbaseWallet,
      onClick: coinbaseHandle
    },
    {
      name: ConnectorNames.WalletConnect,
      icon: iconWalletConnect,
      onClick: walletConnectHandle
    },
    {
      name: ConnectorNames.ImToken,
      icon: iconImToken,
      onClick: imTokenHandle()
    },
    {
      name: ConnectorNames.TokenPocket,
      icon: iconTokenPocket,
      onClick: tokenPocketHandle()
    },
    {
      name: ConnectorNames.MathWallet,
      icon: iconMathWallet,
      onClick: mathWalletHandle()
    },
    {
      name: ConnectorNames.TrustWallet,
      icon: iconTrustWallet,
      onClick: walletConnectHandle
    },
    {
      name: ConnectorNames.OneKeyWallet,
      icon: oneKeyWallet,
      onClick: oneKeyHandle()
    },
    {
      name: ConnectorNames.BitKeepWallet,
      icon: bitkeepWallet,
      onClick: bitkeepHandle()
    }
    /* {
            name: ConnectorNames.Fortmatic,
            icon: iconFortmatic,
            onClick: fortmaticHandle
          },
          {
            name: ConnectorNames.SafePal,
            icon: iconSafePal,
            onClick: walletConnectHandle
          }, */
    /* 暂不添加，因为只支持简单签名，会造成其他地方较大改动
          {
            name: ConnectorNames.BinanceChainWallet,
            icon: iconBinanceChainWallet,
            onClick: binanceChainHandle
          }, */
  ]

  // 如果是dApp浏览器内，则把wallectConnect显示在第一位
  if (isInWalletBrowser()) swap(0, 2, walletList)

  return (
    <>
      <div className="element-connection-wallet">
        <div className="element-connection-wallet-content">
          <h3>{t('wallet_connect_title')}</h3>
          {/* <p className="wallet-tips">
            <span>{t('wallet_connect_tips')}</span>
          </p>
          <p className="wallet-confirm-tips">{t('wallet_connect_confirmTips')}</p> */}
          <div className="wallet-wrapper">
            {walletList.map(
              (item)  => (
                <div key={item.name} className="wallet-button-item" onClick={item.onClick}>
                  <span>{item.name}</span>
                  <img src={item.icon} alt={item.name}/>
                  {/* <em>{t(`wallet_connect_${item.name.toLowerCase()}`)}</em> */}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
