import walletConnectIcon from "../assets/images/walletconnect.png";
import metamaskIcon from "../assets/images/metamask.png";
import coinbaseIcon from "../assets/images/coinbaseWallet.svg";

export {walletConnectIcon, metamaskIcon, coinbaseIcon}

export const RPC_PROVIDER = {
    4: 'https://api-test.element.market/api/v1/jsonrpc',
    1: 'https://api.element.market/api/v1/jsonrpc',
    56: 'https://api.element.market/api/bsc/jsonrpc',
    97: 'https://api-test.element.market/api/bsc/jsonrpc',
    137: 'https://api.element.market/api/polygon/jsonrpc',
    80001: 'https://api-test.element.market/api/polygon/jsonrpc'
}

// export const  bridge="https://element-api-test.eossql.com/bridge/walletconnect"
export const bridge = 'https://element-api.eossql.com/bridge/walletconnect'

export const msg712sign = {
    types: {
        EIP712Domain: [
            {name: 'name', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'},
        ],
        Person: [
            {name: 'name', type: 'string'},
            {name: 'wallet', type: 'address'},
        ],
        Mail: [
            {name: 'from', type: 'Person'},
            {name: 'to', type: 'Person'},
            {name: 'contents', type: 'string'},
        ],
    },
    primaryType: 'Mail',
    domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: '1',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    message: {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
    },
};



