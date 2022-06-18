import {ethers} from "ethers";

export function objectClone(obj: object) {
    return JSON.parse(JSON.stringify(obj))
}

export function itemsIsEquality(items: string[]) {
    return items.every(el => el === items[0])
}



