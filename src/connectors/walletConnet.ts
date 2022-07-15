import {
    IConnector,
    IRPCMap,
    WalletProvider
} from "web3-signer-provider";
import {WalletNames} from "../types";
import {BaseWallet} from "./baseWallet";
import {CHAIN_CONFIG, WALLET_CONNECT_BRIDGE} from "../constants";

// const signingMethods = ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign', 'personal_sign', 'eth_sendTransaction']

const bridge = "https://bridge.walletconnect.org"

export class ConnectWallet extends BaseWallet {
    public walletName: WalletNames = 'wallet_connect'//
    public peerMetaName: string = ""
    public provider: any
    // public connector: IConnector
    // public account: string = ''
    public chainId: number = 0
    public rpcList: IRPCMap

    // Create a connector
    constructor(config: { bridge?: string, rpc?: { [chainId: number]: string } }) {
        super()
        const bridge = config.bridge || WALLET_CONNECT_BRIDGE.urls[0]
        let provider = new WalletProvider({
            bridge,// Required
            // qrcodeModal: QRCodeModal
        })

        this.rpcList = config.rpc || {[this.chainId]: CHAIN_CONFIG[this.chainId].rpcs[0]}

        const walletStr = localStorage.getItem('walletconnect')
        if (walletStr) {
            //IWalletConnectSession
            const walletSession = JSON.parse(walletStr)
            provider = new WalletProvider({storageId: 'walletconnect'})

            const {chainId, accounts, peerMeta} = walletSession
            this.address = accounts[0]
            this.chainId = Number(chainId)
            this.walletName = "wallet_connect";
            this.peerMetaName = peerMeta?.name || ""

            this.provider = new WalletProvider({
                bridge,
                chainId,
                connector:provider.connector
            },this.rpcList)
            this.provider.enable()
        }
        // console.log('connector', this.connector)
        // Check if connection is already established
        // if (!connector.connected) {
        //     // create new session
        //     // connector.createSession()
        //     this.provider = connector
        // }

    };

    getConnector(): IConnector {
        let connector = this.provider
        if (this.provider.connected) {
            connector = this.provider.connector
        } else {
            connector.createSession()
        }
        // Subscribe to connection events
        connector.on('connect', async (error, payload) => {
            if (error) {
                throw error
            }
            // Get provided accounts and chainId
            const {accounts, chainId, peerMeta} = payload.params[0]
            this.address = accounts[0]
            this.chainId = Number(chainId)
            this.walletName = 'wallet_connect';

            this.peerMetaName = peerMeta?.name || ""

            this.provider = new WalletProvider({
                bridge,
                chainId
            },this.rpcList)

            this.provider.enable()
            this.emit('connect', error, payload)
        })

        connector.on('disconnect', (error) => {
            if (error) {
                throw error
            }
            console.log('disconnect', error)
            this.address = ''
            this.chainId = 0
            // this.walletName = ""
            this.peerMetaName = ""
            this.emit('disconnect', error)
        })

        return connector
    }

    disconnect() {
        this.emit('disconnect', 'client')
        this.provider.disconnect();
    }

}



