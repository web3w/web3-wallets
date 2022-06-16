import {hexUtils} from "../src/signature/hexUtils";

console.log(hexUtils.leftPad("29865734822577046633707807835512349254952034870712741802666134457736402829313"))

console.log(hexUtils.leftPad(1))
console.log(hexUtils.leftPad("1"))
console.log(hexUtils.leftPad("0x4"))

const assetData = "0x025717920000000000000000000000002ca5c5c5c44c237730c25204e4f9b92272aac6ad0000000000000000000000000000000000000000000000000000000000003469"
console.assert(hexUtils.slice(assetData, 0, 4)=="0x02571792")
console.log(hexUtils.slice(assetData, 0, 4))
