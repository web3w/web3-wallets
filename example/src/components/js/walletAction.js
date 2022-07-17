import {message, notification} from "antd";

import {utils} from "web3-wallets";
import {msg712sign} from "./config";

import {Web3Accounts} from 'web3-accounts';


export const walletAction = async (wallet, action) => {
    const account = new Web3Accounts({address: wallet.address, chainId: wallet.chainId})
    if (!wallet) {
        message.error('Please select wallet');
        return
    }
    const walletName = wallet.walletName
    const {walletSigner, walletProvider} = wallet
    if (action == 'SignMessage') {
        const signInfo = prompt("Sign Info")
        const signature = await wallet.signMessage(signInfo)
        notification["info"]({
            message: `SignMessage ${walletName}`,
            description: signature
        });
    }

    if (action == 'SignTypedData') {
        const signature = await wallet.signTypedData(msg712sign)
        notification["info"]({
            message: `SignTypedData ${walletName}`,
            description: signature
        });
    }

    if (action == 'GetBalance') {
        const balance = await walletSigner.getBalance()
        const eth = utils.formatEther(balance)

        const msg = `Address: ${wallet.address}  
                       ChainId: ${wallet.chainId}  
                       Balance: ${eth}ETH`
        notification["info"]({
            message: `GetBalance ${walletName}`,
            description: msg
        });
    }

    if (action == 'wethDeposit') {
        // const iface = new ethers.utils.Interface(['function migrate()']);
        // const callData = iface.encodeFunctionData('migrate', []);
        // console.log('callData: ', callData.toString());
debugger
        if (walletProvider.walletName == 'wallet_connect') {
            const {walletName, peerMetaName} = walletProvider
            notification['info']({
                message: walletName,
                description: `Please open ${peerMetaName} App`,
            });
        }
        const ethBal = await account.getGasBalances()
        if (ethBal == "0") {
            message.error("WETH balance eq 0")
            return
        } else {
            await account.wethDeposit(ethBal)
        }

    }

    if (action == 'wethWithdraw') {
        // const iface = new ethers.utils.Interface(['function migrate()']);
        // const callData = iface.encodeFunctionData('migrate', []);
        // console.log('callData: ', callData.toString());

        if (walletProvider.walletName == 'wallet_connect') {
            const {walletName, peerMetaName} = walletProvider
            notification['info']({
                message: walletName,
                description: `Please open ${peerMetaName} App`,
            });
        }
        // const wethBal = await account.getTokenBalances({tokenAddr: account.GasWarpperContract.address})

        const wethBal = await account.wethBalances()
        if (wethBal == "0") {
            message.error("WETH balance eq 0")
            return
        } else {
            await account.wethWithdraw(wethBal)
        }
    }

    if (action == 'wethBalances') {
        // const iface = new ethers.utils.Interface(['function migrate()']);
        // const callData = iface.encodeFunctionData('migrate', []);
        // console.log('callData: ', callData.toString());

        const tokenAddr = account.GasWarpperContract.address
        const wethBal = await account.getTokenBalances({tokenAddr})

        const msg = `WETH_Address: ${tokenAddr}    
                     Balance: ${wethBal} WETH`
        notification["info"]({
            message: `GetBalance ${walletName}`,
            description: msg
        });
    }


};

// if (action == 'Get1559Fee') {
//     const {walletSigner, walletProvider} = wallet
//     const {chainId} = walletProvider
//     console.log(await walletSigner.getBalance())
//     console.log(RPC_PROVIDER[chainId])
//     if (chainId.toString() == '56' || chainId.toString() == '97') {
//         return
//     }
//     // console.log(await walletSDK.get1559Fee())
// }
