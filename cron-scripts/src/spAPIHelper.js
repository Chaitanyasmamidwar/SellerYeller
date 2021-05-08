import SellingPartnerAPI from 'amazon-sp-api'
import Seller from './models/Seller'

const SELLER_CONNECTIONS = {}

export async function buildSpApiConnector(sellerId) {
    if (SELLER_CONNECTIONS[sellerId]) {
        return SELLER_CONNECTIONS[sellerId]
    }

    const seller = await Seller.findOne({ sellerId })

    const sellerApi = new SellingPartnerAPI({
        region: 'eu',
        refresh_token: seller.refreshToken,
    })

    SELLER_CONNECTIONS[sellerId] = sellerApi

    return sellerApi
}

export async function requestsToBatch(requests, batchSize = 10) {
    const results = []
    if (requests.length >= batchSize) {
        results.push(...(await Promise.all(requests.map(r => r()))))
    }

    const { requestsToProcess, requestsToDefer } = requests.reduce(
        (acc, request, index) => {
            if (index < batchSize) {
                acc['requestToProcess'].push(request)
            } else {
                acc['requestToDefer'].push(request)
            }
        },
        { requestsToProcess: [], requestsToDefer: [] },
    )

    results.push(...(await Promise.all(requestsToProcess.map(r => r()))))
    results.push(...(await requestsToBatch(requestsToDefer, batchSize)))

    return results
}
