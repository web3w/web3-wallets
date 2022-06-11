export function objectClone(str: object) {
    return JSON.parse(JSON.stringify(str))
}

export function itemsIsEquality(items: string[]) {
    return items.every(el => el === items[0])
}
