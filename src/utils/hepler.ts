export function objectClone(str: object) {
    return JSON.parse(JSON.stringify(str))
}
