const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const fetch = require("node-fetch")
const secrets = require("../secrets.json")
const app = express();
const port = 8545

const go = async () => {
    app.use(helmet());
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Origin",
            "*"
        );
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    });

    const router = express.Router();
    // const providerUrl = "http://39.102.101.142:8545"
    // const providerUrl = "http://127.0.0.1:8545"
    // const providerUrl = "https://mainnet.infura.io/v3/" + secrets.projectId // metamask
    const providerUrl = "https://rinkeby.infura.io/v3/" + secrets.projectId // metamask

    // const providerUrl = "https://api.element.market/api/v1/jsonrpc"


    //0xeA199722372dea9DF458dbb56be7721af117a9Bc
    // let account1 = web3.eth.accounts.wallet.add('53ce7e01dd100f3c71e10d9618c043139f336eb79a0562e034441b83a5e6db63')

    let methods = [
        // "eth_getBalance",
        "eth_accounts",
        // "eth_blockNumber",
        "eth_getBlockByNumber",
        "net_version",
        "eth_call",
        "eth_getTransactionReceipt"
    ]
    router.all("", async (req, res) => {
        if (req.method == "OPTIONS") {
            res.json()
        }

        if (req.method == "POST") {
            if (req.body.jsonrpc == "2.0") {
                let rpc = JSON.stringify(req.body)


                if (req.body.method === "eth_sendTransaction") {
                    console.log(req.method + "," + req.url + ", rpc:" + JSON.stringify(req.body))
                    let params = req.body.params[0]
                    let exclude = ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]
                    // if (!exclude.includes(params.from)) {
                    //     let singData = await web3.eth.accounts.signTransaction(params, web3.eth.accounts.wallet[params.from].privateKey)
                    //     await web3.eth.sendSignedTransaction(singData.rawTransaction)
                    //     return res.json({jsonrpc: '2.0', id: req.body.id, result: singData.transactionHash})
                    // }

                    if (!exclude.includes(params.from)) {
                        // let singData = await web3.eth.accounts.signTransaction(params, web3.eth.accounts.wallet[params.from].privateKey)
                        const receipt = await web3.eth.sendTransaction(params)
                        console.log(receipt)
                        if (!receipt.status) {
                            console.log(receipt)
                        }
                        return res.json({jsonrpc: '2.0', id: req.body.id, result: receipt.transactionHash})
                    }

                }

                const result = await fetch(providerUrl, {
                    method: 'post',
                    body: rpc,
                    headers: {'Content-Type': 'application/json'},
                })
                let foo = await result.json()


                res.json(foo)
            }
        }
    });

    app.use("", (req, res, next) => {
        // if (!methods.includes(req.body.method) && req.method === "POST") {
        console.log(req.method + "," + req.url + ", rpc:" + JSON.stringify(req.body))
        if (req.body.method === "eth_getBalance") {
            console.log("eth_getBalance")
        }
        // }
        next();
    }, router);
    app.listen(port, () => {
        console.info("Listening on port " + port);
    });
};
