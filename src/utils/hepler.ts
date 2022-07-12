import fetch from "node-fetch";
import {HttpsProxyAgent} from "https-proxy-agent";

export {fetch}

export function objectClone(obj: object) {
    return JSON.parse(JSON.stringify(obj))
}

export function toFixed(x): string | number {
    if (Math.abs(Number(x)) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        let e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
    return x;
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

// export async function fetchRPC(url: string, body: string) {
//     const res = await fetch(url, {
//             method: 'POST',
//             body,
//             headers: {'Content-Type': 'application/json'}
//         }
//     );
//     if (res.ok) {
//         return res.json();
//     } else {
//         throw new Error("Rpc fetch Error")
//     }
// }

async function _handleApiResponse(response: Response) {
    if (response.ok) {
        // this.logger(`Got success: ${response.status}`)
        return response
    }

    let result
    let errorMessage
    try {
        result = await response.text()
        console.log(result)
        result = JSON.parse(result)
    } catch (error: any) {
        console.error('_handleApiResponse', error)
        // Result will be undefined or text
    }

    // this.logger(`Got error ${response.status}: ${JSON.stringify(result)}`)

    switch (response.status) {
        case 400:
            errorMessage = result && result.errors ? result.errors.join(', ') : `Invalid request: ${JSON.stringify(result)}`
            break
        case 401:
        case 403:
            errorMessage = `Unauthorized. Full message was '${JSON.stringify(result)}'`
            break
        case 404:
            errorMessage = `Not found. Full message was '${JSON.stringify(result)}'`
            break
        case 500:
            errorMessage = `Internal server error. OpenSea has been alerted, but if the problem persists please contact us via Discord: https://discord.gg/ga8EJbv - full message was ${JSON.stringify(
                result
            )}`
            break
        case 503:
            errorMessage = `Service unavailable. Please try again in a few minutes. If the problem persists please contact us via Discord: https://discord.gg/ga8EJbv - full message was ${JSON.stringify(
                result
            )}`
            break
        default:
            errorMessage = `Message: ${JSON.stringify(result)}`
            break
    }

    throw new Error(`API Error ${response.status}: ${errorMessage}`)
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

export async function fetchJson(url: string, options?: RequestInit & {
    timeout?: number,
    proxyUrl?: string
}): Promise<Response> {
    const {timeout, proxyUrl} = options || {}
    if (!checkURL(url)) throw new Error("error url:" + url)
    if (proxyUrl && !checkURL(proxyUrl)) throw new Error("error proxyUrl:" + url)

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || 5000);
    let finalOpts: RequestInit = {
        signal: controller.signal
    }
    if (options) {
        finalOpts = {
            ...options,
            headers: {
                ...(options.headers || {})
            },
            signal: controller.signal
        } as RequestInit
    }

    if (proxyUrl && proxyUrl != "") {
        const agent = new HttpsProxyAgent(proxyUrl);
        finalOpts['agent'] = agent
    }
    const data = await fetch(url, finalOpts).then(async (res: any) => _handleApiResponse(res))
    clearTimeout(timeoutId);
    return data
}



