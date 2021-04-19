import SellingPartnerAPI from 'amazon-sp-api'
import { REFRESH_TOKEN_RAW_FLAVOURS } from '../../config'

export default async function fetchOrders(req, res) {
    let sellingPartner = new SellingPartnerAPI({
        region:'eu', // The region of the selling partner API endpoint ("eu", "na" or "fe")
        refresh_token: REFRESH_TOKEN_RAW_FLAVOURS, // The refresh token of your app user
      })
      const result = await sellingPartner.callAPI({
        operation:'getOrders',
        query: {
            MarketplaceIds: ['A21TJRUUN4KGV'],
            LastUpdatedAfter: '2021-01-03',
        },
      })

      const orderId = result.Orders[0].AmazonOrderId

      const userDetails = await sellingPartner.callAPI({
          operation: 'getOrderBuyerInfo',
          path: {
              orderId,
          },
      })
      console.log(userDetails)

      res.status(200).json(result)
}