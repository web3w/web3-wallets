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





