import {getChainRpcUrl, UserAccount} from "../index";

const buyer = '0x9F7A946d935c8Efc7A8329C0d894A69bA241345A';
const seller = '0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401';

;(async () => {
    try {
        const chainId = 4
        const sdk = new UserAccount({
            chainId,
            address: seller,
            // priKey: secrets.accounts[seller]
        })

        const userERC20s = await sdk.getUserTokensBalance({
            tokens: [
                {
                    tokenAddr: '0x44C73A7b3B286c78944aD79b2BBa0204916Cebca',
                    decimals: 18
                },
                {
                    tokenAddr:"0xb506bfaa7661dabf4de80672bd3f13f4610a5fdf",
                    decimals: 18
                }
            ]
        })

        console.log('ERC20s', JSON.stringify(userERC20s, null, 2))


        const userETHs = await sdk.getUserTokensBalance({
            tokens: [],
            account: buyer
        })

        console.log('ETH', JSON.stringify(userETHs, null, 2))

        const userETHERC20Bals = await sdk.getUserTokensBalance({
            tokens: [
                {
                    tokenAddr: '0x44C73A7b3B286c78944aD79b2BBa0204916Cebca',
                    decimals: 18
                },
                {
                    tokenAddr:"0xb506bfaa7661dabf4de80672bd3f13f4610a5fdf",
                    decimals: 18
                }
            ],
            account: buyer
        })

        console.log('ETH+ERC20s', userETHERC20Bals)




        const ethBal = await sdk.getGasBalances()
        console.log(ethBal)

        const accountTokenBalD = await sdk.getUserTokenBalance({})
        console.log(accountTokenBalD)


        const userETHBal = await sdk.getUserTokenBalance({account: buyer})
        console.log('ETH', userETHBal)

        const userERC20Bal = await sdk.getUserTokenBalance({
            tokenAddr: '0x44C73A7b3B286c78944aD79b2BBa0204916Cebca',
            decimals: 18
        })
        console.log('ERC20', userERC20Bal)

        const userETHERC20Bal = await sdk.getUserTokenBalance({
            tokenAddr: '0x44C73A7b3B286c78944aD79b2BBa0204916Cebca',
            decimals: 18,
            account: buyer
        })
        console.log('ETH+ERC20', userETHERC20Bal)


        // return

        const rpcUrl = await getChainRpcUrl(chainId)

        const userETHBalRpc = await sdk.getUserTokenBalance({account: buyer, rpcUrl})
        console.log('ETH RPC', userETHBalRpc)

        const tokenBal = await sdk.getUserTokenBalance({
            tokenAddr: '0x44C73A7b3B286c78944aD79b2BBa0204916Cebca',
            decimals: 18,
            rpcUrl
        })
        console.log('ERC20 RPC', tokenBal)
        const accountTokenBal = await sdk.getUserTokenBalance({
            tokenAddr: '0x44C73A7b3B286c78944aD79b2BBa0204916Cebca',
            decimals: 18,
            account: seller,
            rpcUrl
        })
        console.log('ETH+ERC20 PRC', accountTokenBal)


    } catch (e) {
        console.log(e)
    }

})()
