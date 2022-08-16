import fetch from "node-fetch";

export {fetch}

export function objectClone(obj: object) {
    return JSON.parse(JSON.stringify(obj))
}

export function itemsIsEquality(items: string[]) {
    return items.every(el => el === items[0])
}

export async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({status: 'wakeUp'})
        }, ms)
    })
}

export function checkURL(URL: string) {
    const str = URL;
    const Expression = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
    const objExp = new RegExp(Expression);
    if (objExp.test(str) == true) {
        return true;
    } else {
        return false;
    }
}


/* ------------------------钱包识别----->dApp内置浏览器注入或者系统浏览器插件注入------------------------ */
export const isMetaMask = () => {
    const {ethereum} = window
    // @ts-ignore
    return ethereum && ethereum.isMetaMask
}

export const isCoinBase = () => {
    const {ethereum} = window
    // @ts-ignore
    if (ethereum) return ethereum.isMetaMask && ethereum.overrideIsMetaMask
}

export const isBitKeep = () => {
    // @ts-ignore
    const {ethereum, bitkeep} = window
    // @ts-ignore
    if (ethereum) return ethereum.isMetaMask
    // @ts-ignore
    if (bitkeep) return bitkeep.ethereum.isBitKeep

}

export const isOneKey = () => {
    // @ts-ignore
    const {ethereum, $onekey} = window
    // @ts-ignore
    if (ethereum) return ethereum.isMetaMask
    // @ts-ignore
    if ($onekey) return $onekey.ethereum.isOneKey

}

export const isImToken = () => {
    const {ethereum} = window
    // @ts-ignore
    return ethereum && ethereum.isImToken
}

export const isTokenPocket = () => {
    const {ethereum} = window
    // @ts-ignore
    return ethereum && ethereum.isTokenPocket
}
export const isMathWallet = () => {
    const {ethereum} = window
    // @ts-ignore
    return ethereum && ethereum.isMathWallet
}


