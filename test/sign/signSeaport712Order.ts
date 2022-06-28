import {
    getEIP712Hash, getEIP712StructHash,
} from "../../src/utils/eip712TypeData";


export const SEAPORT_CONTRACT_NAME = "Seaport";
export const SEAPORT_CONTRACT_VERSION = "1.1";
export const EIP_712_ORDER_TYPE = {
    OrderComponents: [
        {name: "offerer", type: "address"},
        {name: "zone", type: "address"},
        {name: "offer", type: "OfferItem[]"},
        {name: "consideration", type: "ConsiderationItem[]"},
        {name: "orderType", type: "uint8"},
        {name: "startTime", type: "uint256"},
        {name: "endTime", type: "uint256"},
        {name: "zoneHash", type: "bytes32"},
        {name: "salt", type: "uint256"},
        {name: "conduitKey", type: "bytes32"},
        {name: "counter", type: "uint256"},
    ],
    OfferItem: [
        {name: "itemType", type: "uint8"},
        {name: "token", type: "address"},
        {name: "identifierOrCriteria", type: "uint256"},
        {name: "startAmount", type: "uint256"},
        {name: "endAmount", type: "uint256"},
    ],
    ConsiderationItem: [
        {name: "itemType", type: "uint8"},
        {name: "token", type: "address"},
        {name: "identifierOrCriteria", type: "uint256"},
        {name: "startAmount", type: "uint256"},
        {name: "endAmount", type: "uint256"},
        {name: "recipient", type: "address"},
    ],
};
// console.log(foo)
const typedData = {
    "types": {
        "EIP712Domain": [],
        ...EIP_712_ORDER_TYPE
    },
    "domain": {
        "chainId": 1,
        "verifyingContract": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
        "name": SEAPORT_CONTRACT_NAME,
        "version": SEAPORT_CONTRACT_VERSION
    },
    "primaryType": "OrderComponents",
    "message": {
        "offerer": "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401",
        "zone": "0x0000000000000000000000000000000000000000",
        "orderType": 2,
        "startTime": "1655517905",
        "endTime": "1655517905057",
        "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "salt": "0x181748e8725",
        "offer": [
            {
                "itemType": 3,
                "token": "0xb6316833725f866f2aad846de30a5f50f09e247b",
                "identifierOrCriteria": "1655202183834",
                "startAmount": "1",
                "endAmount": "1"
            }
        ],
        "consideration": [
            {
                "itemType": 0,
                "token": "0x0000000000000000000000000000000000000000",
                "identifierOrCriteria": "0",
                "startAmount": "20000000000000000",
                "endAmount": "20000000000000000",
                "recipient": "0x0A56b3317eD60dC4E1027A63ffbE9df6fb102401"
            }
        ],
        "totalOriginalConsiderationItems": "1",
        "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
        "counter": 0
    }
}

const hash1 = getEIP712StructHash(typedData.primaryType, EIP_712_ORDER_TYPE, typedData.message)
const orderHash = '0xa1dc54ca93f82077855645df0a030fd8c242a13cd4e0c29682ab88a927524a1d'
console.assert(hash1 == orderHash, "error")

