import SellingPartnerAPI from 'amazon-sp-api'
import { add, format } from 'date-fns'
import _ from 'lodash'

import Seller from './models/Seller'
import Order from './models/Order'
import OrderBuyerInfo from './models/OrderBuyerInfo'
import OrderItem from './models/OrderItem'

export default async function loadOrders() {
    console.log("RUNNING LOAD ORDERSS:::")
    const sellers = await Seller.find({ refreshToken: { $exists: true }})
    
    sellers.map(fetchOrders)
}

async function fetchOrders(seller) {
    const spapi = new SellingPartnerAPI({
        region: 'eu',
        refresh_token: seller.refreshToken,
    })

    const today = new Date()
    const lastWeek = add(today, { days: -90 })

    const { Orders: orders } = await spapi.callAPI({
        operation:'getOrders',
        query: {
            MarketplaceIds: [seller.marketplaceId],
            LastUpdatedAfter: format(lastWeek, 'yyyy-MM-dd')
        }
    })

    if(!orders.length) {
        return
    }

    console.log(seller, "ORDERS LOADED FOR SELLER ", orders)
    const orderIds = orders.map(o => o.AmazonOrderId)
    const existingBuyers = await OrderBuyerInfo.find({ AmazonOrderId: orderIds })
    const buyersByOrderId = _.keyBy(existingBuyers, 'AmazonOrderId') 

    const existingOrderIds = Object.keys(buyersByOrderId)
    const newOrderIds = _.difference(orderIds, existingOrderIds)

    // const cancelledOrders = orders.map((o,i) => o.OrderStatus === 'Canceled' ? i : false)
    await Promise.all(orders.map(order => 
        fetchAndAddBuyerInformation(seller, order, buyersByOrderId)
    ))
    await truncateExistingOrders(orderIds)
    await saveOrdersToDb(orders, seller)
    await fetchOrderItems(seller, newOrderIds)
}

async function fetchAndAddBuyerInformation(seller, order, existingBuyers) {
    const existingBuyer = existingBuyers[order.AmazonOrderId]

    if(existingBuyer) {
        return
    }

    const spapi = new SellingPartnerAPI({
        region: 'eu',
        refresh_token: seller.refreshToken,
    })
    const result = await spapi.callAPI({
        operation: 'getOrderBuyerInfo',
        path: {
            orderId: order.AmazonOrderId,
        },
    })
    const newBuyer = new OrderBuyerInfo(result)

    await newBuyer.save()
    console.log('BUYER INFOOO SAved::::: ', newBuyer)
}

function saveOrdersToDb(orders, seller) {
    orders.forEach(o => mapAmazonOrderToSchema(o, seller))
    return Order.insertMany(orders)
}

function mapAmazonOrderToSchema(amazonOrder, seller) {
    amazonOrder.SellerId = seller.sellerId
    amazonOrder.OrderTotal = Number(amazonOrder.OrderTotal.Amount)
}

export function truncateExistingOrders(orderIds) {
    return Order.deleteMany({ AmazonOrderID: orderIds })
}

async function fetchOrderItems(seller, orderIds) {
    const spapi = new SellingPartnerAPI({
        region: 'eu',
        refresh_token: seller.refreshToken,
    })

    console.log("FETCHING ORDER ITEMS")
    const orderItemsPerOrder = await Promise.all(orderIds.map(async ( id, index ) => {
        const result = await spapi.callAPI({
            operation: 'getOrderItems',
            path: {
                orderId: id,
            },
        })

        console.log(" COMPLETED ORDER ITEM REQ FOR ORDER ID AND INDEX ", id, index)

        result.OrderItems.forEach(item => item.OrderId = result.AmazonOrderId)

        return result.OrderItems
    }))

    const orderItems = _.flatten(orderItemsPerOrder)

    saveOrderItems(orderItems)
}

async function getCatalogItems(seller, orderIds) {
    const spapi = new SellingPartnerAPI({
        region: 'eu',
        refresh_token: seller.refreshToken,
    })
    const result = await spapi.callAPI({
        operation: 'getCatalogItem',
        query: {
            MarketplaceId: seller.marketplaceId,
        },
        path: { asin: 'B08L8FS3VM' },
    })

    console.log(JSON.stringify(result), 'CATALOG ITEMSSL:::::::]]n]n]n]n]\n\n\n\n\n::::::')
}

async function saveOrderItems(amazonOrderItems) {
    amazonOrderItems.forEach( mapAmazonOrderItemToSchema )

    await OrderItem.insertMany(amazonOrderItems)

    console.log("ROWSS INSERTEDD:::::")
}

function mapAmazonOrderItemToSchema(orderItem) {
    orderItem.ItemPrice = Number(orderItem.ItemPrice?.Amount || 0) || undefined
}